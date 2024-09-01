#---------------api.py---------------

# Run this in terminal: python api.py or python3 api.py (depends on python version).
# Must download pyemvue library first. Use this command: pip install Flask or pip3 install Flask (depends on python version).

# API ENDPOINT: http://127.0.0.1:5000/api/getRecentUsage

from flask import Flask, jsonify
import pyemvue
from pyemvue.enums import Scale, Unit
import os
from config import EMVUE_EMAIL, EMVUE_PASSWORD  

app = Flask(__name__)

def fetch_energy_usage():
    vue = pyemvue.PyEmVue()
    vue.login(username=EMVUE_EMAIL, password=EMVUE_PASSWORD)  

    devices = vue.get_devices()
    device_gids = [device.device_gid for device in devices]

    # GATHER USAGE DATA FOR ALL DEVICES
    device_usage_data = {}
    for device_gid in device_gids:
        usage = vue.get_device_list_usage(deviceGids=[device_gid], instant=None, scale=Scale.SECOND.value, unit=Unit.KWH.value)
        channels_data = usage[device_gid].channels
        channel_usage = {channel_num: {'name': channel.name, 'usage': channel.usage} for channel_num, channel in channels_data.items()}
        device_usage_data[device_gid] = {
            'device_name': usage[device_gid].device_name,
            'channels': channel_usage
        }

    return device_usage_data

@app.route('/api/getRecentUsage', methods=['GET'])
def get_recent_usage():
    try:
        usage_data = fetch_energy_usage()
        return jsonify(usage_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)