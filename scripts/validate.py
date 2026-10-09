"""Validate the public, credential-free Git marketplace before publishing."""
import json,re,xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def read(name):return json.loads((ROOT/name).read_text())
catalog=read('.agents/plugins/marketplace.json')
manifest=read('nabit-video-recommendation/plugin.json')
release=read('plugin-release.json')
mcp=read('nabit-video-recommendation/mcp.json')
assert catalog['name']=='nabit-oauth'
assert len(catalog['plugins'])==1
entry=catalog['plugins'][0]
assert entry['name']==manifest['name']=='nabit-video-recommendation'
assert entry['source']=={'source':'local','path':'./nabit-video-recommendation'}
assert entry['policy']['authentication']=='ON_INSTALL'
assert entry['category']=='Productivity'
assert manifest['version']==release['latestVersion']
assert re.fullmatch(r'\d+\.\d+\.\d+',manifest['version'])
assert release['distribution']=='git-marketplace'
assert release['automaticUpdates'] is False and release['requiresReauthorization'] is False
assert mcp['mcpServers']=={'nabit':{'type':'streamable-http','url':'https://beta.nabit.ai/mcp'}}
allowed={'.agents/plugins/marketplace.json','nabit-video-recommendation/plugin.json','nabit-video-recommendation/mcp.json','nabit-video-recommendation/skills/setup/SKILL.md','nabit-video-recommendation/skills/video-recommendation/SKILL.md',*[f'nabit-video-recommendation/skills/{name}/SKILL.md' for name in ['products','research','library','settings']],'nabit-video-recommendation/assets/nabit-logo.svg','nabit-video-recommendation/assets/nabit-mark.svg','plugin-release.json','README.md','.gitignore','scripts/validate.py','.github/workflows/validate.yml'}
allowed.update({'nabit-video-recommendation/scripts/codex-client.mjs','nabit-video-recommendation/assets/video-widget.html','nabit-video-recommendation/skills/setup/references/continuation.md'})
interface=manifest['extensions']['com.openai']['interface']
for field in ['logo','logoDark','composerIcon','composerIconDark']:
    relative=interface[field]
    assert relative.startswith('./assets/') and '..' not in Path(relative).parts
    asset=ROOT/'nabit-video-recommendation'/relative
    assert asset.is_file() and asset.stat().st_size<=5*1024*1024
    svg=ET.fromstring(asset.read_text())
    assert svg.tag=='{http://www.w3.org/2000/svg}svg'
    box=[float(x) for x in svg.attrib['viewBox'].split()]
    assert len(box)==4 and box[2]==box[3] and box[2]>=48
for p in ROOT.rglob('*'):
    if '.git' in p.parts or '__pycache__' in p.parts:continue
    assert not p.is_symlink(),f'Symlinks are not part of this package: {p.name}'
    if not p.is_file():continue
    name=p.relative_to(ROOT).as_posix()
    assert name in allowed,f'Unexpected public file: {name}'
    assert not re.search(r'nabit_o(?:at|rt)_[a-f0-9]{64}|gh[pousr]_[A-Za-z0-9]{30,}|(?m:^-----BEGIN [A-Z ]*PRIVATE KEY-----$)',p.read_text()),f'Credential-like content: {name}'
for name in ['setup','products','video-recommendation','research','library','settings']:
    content=(ROOT/f'nabit-video-recommendation/skills/{name}/SKILL.md').read_text()
    assert content.startswith('---\n') and '\nname: '+name+'\n' in content
print(f'Validated Nabit {manifest["version"]}: one Git marketplace plugin, six skills, HTTPS OAuth MCP, optional credential-managed Codex helper and player asset; no user credentials.')
