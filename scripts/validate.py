"""Validate the public, credential-free Git marketplace before publishing."""
import json,re
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
assert manifest['version']==release['latestVersion']
assert re.fullmatch(r'\d+\.\d+\.\d+',manifest['version'])
assert release['distribution']=='git-marketplace'
assert release['automaticUpdates'] is False and release['requiresReauthorization'] is False
assert mcp['mcpServers']=={'nabit':{'type':'streamable-http','url':'https://beta.nabit.ai/mcp'}}
allowed={'.agents/plugins/marketplace.json','nabit-video-recommendation/plugin.json','nabit-video-recommendation/mcp.json','nabit-video-recommendation/skills/setup/SKILL.md','nabit-video-recommendation/skills/video-recommendation/SKILL.md','plugin-release.json','README.md','.gitignore','scripts/validate.py','.github/workflows/validate.yml'}
for p in ROOT.rglob('*'):
    if '.git' in p.parts or '__pycache__' in p.parts:continue
    assert not p.is_symlink(),f'Symlinks are not part of this package: {p.name}'
    if not p.is_file():continue
    name=p.relative_to(ROOT).as_posix()
    assert name in allowed,f'Unexpected public file: {name}'
    assert not re.search(r'nabit_o(?:at|rt)_[a-f0-9]{64}|gh[pousr]_[A-Za-z0-9]{30,}|(?m:^-----BEGIN [A-Z ]*PRIVATE KEY-----$)',p.read_text()),f'Credential-like content: {name}'
for name in ['setup','video-recommendation']:
    content=(ROOT/f'nabit-video-recommendation/skills/{name}/SKILL.md').read_text()
    assert content.startswith('---\n') and '\nname: '+name+'\n' in content
print(f'Validated Nabit {manifest["version"]}: one Git marketplace plugin, two skills, HTTPS OAuth MCP, no bundled runtime or credentials.')
