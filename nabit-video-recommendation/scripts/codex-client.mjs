// Fresh credential-managed MCP transport when a host cannot reload its active tools.
// Never read credential files, change CODEX_HOME, or start a model turn.
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import readline from 'node:readline';
import {pathToFileURL} from 'node:url';

const allowed=new Set('get_connection_status get_recommendation_profile get_scheduled_video_digest update_recommendation_profile get_video_recommendations record_video_feedback save_video_recommendation mark_recommendations_returned get_account_profile list_products get_product preview_product create_product update_product archive_product restore_product get_account_usage request_recommendations get_recommendation_batch next_recommendation_batch get_video_details request_video_analysis start_research get_research_status list_saved_videos save_batch_video remove_saved_video get_recommendation_settings update_recommendation_settings record_recommendation_decision get_trending_videos update_trending_tracking render_video_recommendations'.split(' '));
function validateArguments(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||JSON.stringify(value).length>16000)throw Error('Use a bounded JSON arguments object');
 const forbidden=new Set(['token','access_token','refresh_token','password','authorization','accountId','workspaceId','tenant','endpoint','baseUrl']);
 function inspect(v){if(v&&typeof v==='object')for(const [key,item]of Object.entries(v)){if(forbidden.has(key))throw Error('Credentials, caller identity and endpoints cannot be supplied');inspect(item);}}
 inspect(value);
}
export async function callNabit(tool,args={},spawnProcess=spawn){
 if(!allowed.has(tool))throw Error('Unknown Nabit capability');validateArguments(args);
 const manifest=JSON.parse(await fs.readFile(new URL('../plugin.json',import.meta.url),'utf8'));
 const child=spawnProcess('codex',['app-server','--stdio'],{env:process.env,stdio:['pipe','pipe','pipe']});
 const pending=new Map();let sequence=0;
 child.stderr.on('data',()=>{});
 const lines=readline.createInterface({input:child.stdout});
 lines.on('line',line=>{let m;try{m=JSON.parse(line);}catch{return;}if(m.id!==undefined&&pending.has(m.id)){const p=pending.get(m.id);clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error('Codex MCP request failed: '+m.error.message)):p.resolve(m.result);}});
 const fail=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Codex MCP client stopped; verify the installed Codex CLI'));}pending.clear();};child.on('error',fail);child.on('exit',fail);
 const rpc=(method,params)=>new Promise((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error('Codex MCP request timed out; inspect the existing task before retrying'));},45000);pending.set(id,{resolve,reject,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});
 const unpack=r=>{if(r.isError)throw Error(r.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n')||'Nabit operation failed');return r.structuredContent??JSON.parse(r.content.find(c=>c.type==='text').text);};
 try{
  await rpc('initialize',{clientInfo:{name:'nabit_plugin_continuation',version:manifest.version},capabilities:{experimentalApi:true}});child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'initialized'})+'\n');
  const started=await rpc('thread/start',{cwd:process.cwd(),ephemeral:true,approvalPolicy:'never'}),threadId=started.thread.id;
  const status=await rpc('mcpServerStatus/list',{threadId,serverName:'nabit',detail:'toolsAndAuthOnly'}),server=status.data.find(s=>s.name==='nabit');
  if(!server?.tools?.get_connection_status)throw Error('Nabit tools are unavailable in this Codex environment; connect the installed plugin');
  const call=(name,arguments_)=>rpc('mcpServer/tool/call',{threadId,server:'nabit',tool:name,arguments:arguments_});
  const raw=await call('get_connection_status',{clientVersion:manifest.version}),connection=unpack(raw);
  if(tool==='get_connection_status')return {result:raw,connection};
  if(!connection.connected||connection.dataMode!=='live')throw Error('Nabit is not connected live; complete the host connection flow before continuing');
  if(!server.tools[tool])throw Error('This Nabit capability is unavailable; update the installed plugin/server');
  const result=await call(tool,args);unpack(result);return {result,connection};
 }finally{for(const p of pending.values())clearTimeout(p.timer);pending.clear();lines.close();child.stdin.end();child.kill('SIGTERM');}
}
export async function writePreview(result,output){
 const data=result._meta?.['nabit/widget'];
 if(!data||!Array.isArray(data.items)||!Array.isArray(data.playback))throw Error('Nabit did not return playable UI data');
 const template=await fs.readFile(new URL('../assets/video-widget.html',import.meta.url),'utf8');
 const json=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 const html=template.replace('<head>','<head><script>window.__NABIT_BOOTSTRAP__='+json+';</script>');
 await fs.writeFile(output,html,{mode:0o600,flag:'wx'});
 return {previewPath:output,total:data.items.length,playbackExpiresAt:Math.min(...data.playback.map(p=>p.expiresAt))};
}
async function main(){
 const [mode,tool,...rest]=process.argv.slice(2);
 if(mode==='call'){
  if(rest.length&&!(rest.length===2&&rest[0]==='--args-file'))throw Error('Usage: codex-client.mjs call TOOL [--args-file JSON_FILE]');
  const args=rest.length?JSON.parse(await fs.readFile(rest[1],'utf8')):{};
  const {result}=await callNabit(tool,args);console.log(JSON.stringify(result.structuredContent??JSON.parse(result.content.find(c=>c.type==='text').text),null,2));
 }else if(mode==='preview'){
  if(!tool||rest.length!==2||rest[0]!=='--output')throw Error('Usage: codex-client.mjs preview JSON_ARGS_FILE --output HTML_FILE');
  const args=JSON.parse(await fs.readFile(tool,'utf8')),{result}=await callNabit('render_video_recommendations',args);
  console.log(JSON.stringify(await writePreview(result,rest[1]),null,2));
 }else throw Error('Use call TOOL [--args-file FILE], or preview JSON_ARGS_FILE --output HTML_FILE');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(error=>{console.error(error.message.replace(/nabit_(?:oat|play)_[a-f0-9]{64}/g,'[redacted]'));process.exitCode=1;});
