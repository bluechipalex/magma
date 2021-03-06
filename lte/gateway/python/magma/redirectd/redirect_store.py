"""
Copyright (c) 2018-present, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree. An additional grant
of patent rights can be found in the PATENTS file in the same directory.
"""

from lte.protos.policydb_pb2 import RedirectInformation

from magma.common.redis.client import get_default_client
from magma.common.redis.containers import RedisHashDict
from magma.common.redis.serializers import get_proto_deserializer, \
    get_proto_serializer


class RedirectDict(RedisHashDict):
    """
    RedirectDict uses the RedisHashDict collection to store a mapping of ips
    to RedirectInformation. Setting and deleting items in the dictionary syncs
    with Redis automatically
    """
    _DICT_HASH = "redirectd:rules"

    def __init__(self):
        client = get_default_client()
        super().__init__(
            client,
            self._DICT_HASH,
            get_proto_serializer(),
            get_proto_deserializer(RedirectInformation))

    def __missing__(self, key):
        """Instead of throwing a key error, return None when key not found"""
        return None
