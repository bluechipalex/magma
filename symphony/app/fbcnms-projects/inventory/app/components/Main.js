/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import Admin from './admin/Admin';
import Automation from './automation/Automation';
import FilesUploadContextProvider from './context/FilesUploadContextProvider';
import Hub from '@fbcnms/hub/app/components/Main';
import IDToolMain from './id/IDToolMain';
import Inventory from './Inventory';
import MagmaMain from '@fbcnms/magmalte/app/components/Main';
import MainContext, {MainContextProvider} from './MainContext';
import React from 'react';
import SymphonyFilesUploadSnackbar from './SymphonyFilesUploadSnackbar';
import WorkOrdersMain from './work_orders/WorkOrdersMain';

import LoadingIndicator from '../common/LoadingIndicator';
import {Route, Switch} from 'react-router-dom';

export default () => (
  <MainContextProvider>
    <MainContext.Consumer>
      {mainContext =>
        mainContext.initializing ? (
          <LoadingIndicator />
        ) : (
          <FilesUploadContextProvider>
            <Switch>
              <Route path="/nms" component={MagmaMain} />
              <Route path="/hub" component={Hub} />
              <Route path="/inventory" component={Inventory} />
              <Route path="/workorders" component={WorkOrdersMain} />
              {mainContext.me?.permissions.adminPolicy.canRead ? (
                <Route path="/admin" component={Admin} />
              ) : null}
              <Route path="/automation" component={Automation} />
              <Route path="/id" component={IDToolMain} />
            </Switch>
            <SymphonyFilesUploadSnackbar />
          </FilesUploadContextProvider>
        )
      }
    </MainContext.Consumer>
  </MainContextProvider>
);
