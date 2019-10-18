/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { generatePath } from 'react-router-dom';
import { PLUGIN } from '../../common/constants';
import { API_ROOT } from '../../common/routes';
import { patterns } from '../routes';
import { useCore } from '.';
import { DetailViewPanelName } from '..';

// TODO: get this from server/integrations/handlers.ts (move elsewhere?)
// seems like part of the name@version change
interface DetailParams {
  name: string;
  version: string;
  panel?: DetailViewPanelName;
}

function addBasePath(path: string) {
  const { http } = useCore();
  return http.basePath.prepend(path);
}

function appRoot(path: string) {
  // include '#' because we're using HashRouter
  return addBasePath(patterns.APP_ROOT + '#' + path);
}

export function useLinks() {
  return {
    toAssets: (path: string) => addBasePath(`/plugins/${PLUGIN.ID}/assets/${path}`),
    toImage: (path: string) => addBasePath(`${API_ROOT}${path}`),
    toListView: () => appRoot(patterns.LIST_VIEW),
    toDetailView: ({ name, version, panel }: DetailParams) => {
      // panel is optional, but `generatePath` won't accept `path: undefined`
      // so use this to pass `{ pkgkey }` or `{ pkgkey, panel }`
      const params = Object.assign({ pkgkey: `${name}-${version}` }, panel ? { panel } : {});
      return appRoot(generatePath(patterns.DETAIL_VIEW, params));
    },
  };
}