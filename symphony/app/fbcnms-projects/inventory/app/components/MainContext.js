/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  MainContextMeQuery,
  MainContextMeQueryResponse,
} from './__generated__/MainContextMeQuery.graphql';
import type {SessionUser} from '@fbcnms/magmalte/app/common/UserModel';

import * as React from 'react';
import RelayEnvironment from '../common/RelayEnvironment';
import {fetchQuery, graphql} from 'relay-runtime';
import {useContext, useEffect, useState} from 'react';

export type MainContextValue = {
  initializing: boolean,
  integrationUserDefinition: SessionUser,
  ...MainContextMeQueryResponse,
};

const integrationUserDefinitionBuilder: (
  ?MainContextMeQueryResponse,
) => SessionUser = queryResponse => ({
  email: queryResponse?.me?.user.email || '',
  isSuperUser: queryResponse?.me?.permissions.adminPolicy.canRead || false,
});

const DEFUALT_VALUE = {
  initializing: true,
  integrationUserDefinition: integrationUserDefinitionBuilder(),
  me: null,
};

const MainContext = React.createContext<MainContextValue>(DEFUALT_VALUE);

export function useMainContext() {
  return useContext(MainContext);
}

const meQuery = graphql`
  query MainContextMeQuery {
    me {
      user {
        id
        authID
        email
        firstName
        lastName
      }
      permissions {
        canWrite
        adminPolicy {
          canRead
        }
      }
    }
  }
`;

const getLoggedUserSettings = () => {
  return fetchQuery<MainContextMeQuery>(RelayEnvironment, meQuery, {});
};
type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export function MainContextProvider(props: Props) {
  const [value, setValue] = useState(DEFUALT_VALUE);
  useEffect(() => {
    getLoggedUserSettings()
      .then(meValue =>
        setValue(currentValue => ({
          ...currentValue,
          integrationUserDefinition: integrationUserDefinitionBuilder(meValue),
          ...meValue,
        })),
      )
      .finally(() =>
        setValue(currentValue => ({
          ...currentValue,
          initializing: false,
        })),
      );
  }, []);
  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
}

export default MainContext;
