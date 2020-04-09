#!/usr/bin/env python3
#
# Copyright (c) 2016-present, Facebook, Inc.
# All rights reserved.
#
# This source code is licensed under the BSD-style license found in the
# LICENSE file in the root directory of this source tree. An additional grant
# of patent rights can be found in the PATENTS file in the same directory.

# This script creates the build context for the orc8r docker builds.
# It first creates a tmp directory, and then copies the cloud directories
# for all modules into it.

import argparse
import yaml

def main() -> None:
    args = _parse_args()
    with open(args.template) as templateFile:
        templateYaml = yaml.safe_load(templateFile)
        templateYaml["secrets"]["docker"]["registry"] = "testreg"
        templateYaml["secrets"]["docker"]["username"] = "alex"
        outputFile = open(args.output, "w")
        yaml.dump(templateYaml, outputFile, default_flow_style = False, allow_unicode = True, encoding = None)
        outputFile.close()


def _parse_args() -> argparse.Namespace:
    """ Parse the command line args """
    parser = argparse.ArgumentParser(description='Orc8r Helm Input Generator')
    parser.add_argument('--output', '-o',
                        help="Path to output generated values file to", type=str)
    parser.add_argument('--template', '-t',
                        help="Template for values yaml input file", type=str)  
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    main()