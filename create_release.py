import datetime
import json
from collections import OrderedDict
import os
import zipfile
import copy

def createRelease():
	version = today_version()
	manifest_content = read_manifest()
	create_versioned_manifest(copy.deepcopy(manifest_content), version)
	create_zip_file(version)
	clean_up(manifest_content)

def today_version():
	return '{dt.year}.{dt.month}.{dt.day}'.format(dt = datetime.datetime.now())

def read_manifest():
	in_file = open('manifest.json', 'r')
	manifest_content = json.loads(in_file.read(), object_pairs_hook=OrderedDict)
	in_file.close()
	return manifest_content

def create_versioned_manifest(manifest_content, version):
	manifest_content['version'] = version
	manifest_json = json.dumps(manifest_content, indent=4, separators=(',', ': '))
	out_file = open('manifest.json', 'w')
	out_file.write(manifest_json)
	out_file.close()

def create_zip_file(version):
	zip_file_name = 'cleanHomescreenAddon_' + version + '.zip'
	print("creating release package " + zip_file_name)
	zip_file = zipfile.ZipFile(zip_file_name, 'w')
	file_names = ["manifest.json",
			 "cleanHomescreen.js",
			 "icon/128.png",
			 "icon/512.png"]
	for file_name in file_names:
		zip_file.write(file_name)
	zip_file.close()

def clean_up(manifest_content):
	out_file = open('manifest.json', 'w')
	manifest_json = json.dumps(manifest_content, indent=4, separators=(',', ': '))
	out_file.write(manifest_json)
	out_file.close()

if __name__ == '__main__':
	createRelease()
