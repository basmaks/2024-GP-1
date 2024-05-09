#---------------fetch_data.py---------------

# Run this in terminal: python fetch_data.py or python3 fetch_data.py (depends on python version).
# Must download pyemvue library first. Use this command: pip install pyemvue or pip3 install pyemvue (depends on python version).

import pyemvue
from pyemvue.enums import Scale, Unit
from config import EMVUE_EMAIL, EMVUE_PASSWORD  

def print_recursive(usage_dict, info, depth=0):
    for gid, device in usage_dict.items():
        for channelnum, channel in device.channels.items():
            name = channel.name
            if name == 'Main':
                name = info[gid].device_name
            print('-'*depth, f'{gid} {channelnum} {name} {channel.usage} kwh')
            if channel.nested_devices:
                print_recursive(channel.nested_devices, info, depth+1)

vue = pyemvue.PyEmVue()

#USERNAME AND PASSWORD
vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD, token_storage_file='keys.json')

devices = vue.get_devices()
device_gids = []
device_info = {}
for device in devices:
    if not device.device_gid in device_gids:
        device_gids.append(device.device_gid)
        device_info[device.device_gid] = device
    else:
        device_info[device.device_gid].channels += device.channels

device_usage_dict = vue.get_device_list_usage(deviceGids=device_gids, instant=None, scale=Scale.MINUTE.value, unit=Unit.KWH.value)
print('device_gid channel_num name usage unit')
print_recursive(device_usage_dict, device_info)