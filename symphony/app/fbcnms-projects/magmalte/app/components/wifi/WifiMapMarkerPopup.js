/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {MagmaGatewayFeature} from '@fbcnms/magmalte/app/common/GeoJSON';

import React from 'react';

import {makeStyles} from '@material-ui/styles';

type Props = {
  feature: MagmaGatewayFeature,
};

const useStyles = makeStyles(() => ({
  container: {
    padding: 12,
  },
  detailList: {
    margin: '0px',
  },
  // we want to remove the padding of the MapBox popup container because it
  // intefers with the `mouseleave` event listener we install on the popup
  // element rendered inside the container
  '@global': {
    'div.mapboxgl-popup-content': {padding: 0},
  },
}));

export default function WifiMapMarkerPopup({feature}: Props) {
  const classes = useStyles();
  const device = feature.properties.device;
  if (!device) {
    return <></>;
  }
  return (
    <div className={classes.container}>
      <b>ID: </b>
      {device.id}
      <br />
      <b>Info: </b>
      {device.info}
      <br />
      {device.status && (
        <>
          <b>Mesh IP: </b>
          <ul className={classes.detailList}>
            {(device.status.meta?.mesh0_ip || '')
              .split(',')
              .filter(ip => ip !== '')
              .map((ip, i) => (
                <li key={i}>{ip}</li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
