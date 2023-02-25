import React from 'react';

import axios, {AxiosError} from 'axios';

import * as Sentry from 'sentry-expo';

import Log from 'network/log';

import {QueryClient, useQuery} from '@tanstack/react-query';
import {ClientContext, ClientProps} from 'clientContext';
import {logQueryKey} from 'hooks/logger';
import {AvalancheCenterID, AvalancheWarning, avalancheWarningSchema} from 'types/nationalAvalancheCenter';
import {apiDateString, RequestedTime} from 'utils/date';
import {ZodError} from 'zod';

export const useAvalancheWarning = (center_id: AvalancheCenterID, zone_id: number, requested_time: RequestedTime) => {
  const {nationalAvalancheCenterHost} = React.useContext<ClientProps>(ClientContext);
  return useQuery<AvalancheWarning, AxiosError | ZodError>({
    queryKey: queryKey(nationalAvalancheCenterHost, center_id, zone_id, requested_time),
    queryFn: async () => fetchAvalancheWarning(nationalAvalancheCenterHost, center_id, zone_id, requested_time),
    cacheTime: 12 * 60 * 60 * 1000, // hold on to this cached data for half a day (in milliseconds)
  });
};

function queryKey(nationalAvalancheCenterHost: string, center_id: string, zone_id: number, requestedTime: RequestedTime) {
  let prefix = '';
  let date: Date = null;
  if (requestedTime === 'latest') {
    prefix = 'latest';
    date = new Date();
  } else {
    prefix = 'archived';
    date = requestedTime;
  }
  return logQueryKey([
    `${prefix}-warning`,
    {
      host: nationalAvalancheCenterHost,
      center: center_id,
      zone_id: zone_id,
      requestedTime: apiDateString(date),
    },
  ]);
}

const prefetchAvalancheWarning = async (queryClient: QueryClient, nationalAvalancheCenterHost: string, center_id: string, zone_id: number, requested_time: RequestedTime) => {
  await queryClient.prefetchQuery({
    queryKey: queryKey(nationalAvalancheCenterHost, center_id, zone_id, requested_time),
    queryFn: async () => {
      Log.prefetch('starting fragment prefetch');
      const result = await fetchAvalancheWarning(nationalAvalancheCenterHost, center_id, zone_id, requested_time);
      Log.prefetch('fragment request finished');
      return result;
    },
  });
  Log.prefetch('warning data is cached with react-query');
};

const fetchAvalancheWarning = async (nationalAvalancheCenterHost: string, center_id: string, zone_id: number, requested_time: RequestedTime): Promise<AvalancheWarning> => {
  const url = `${nationalAvalancheCenterHost}/v2/public/product`;
  const params = {
    center_id: center_id,
    type: 'warning',
    zone_id: zone_id,
  };
  if (requested_time !== 'latest') {
    params['published_time'] = apiDateString(requested_time); // the API accepts a _date_ and appends 19:00 to it for a time...
  }
  const {data} = await axios.get(url, {
    params: params,
  });

  const parseResult = avalancheWarningSchema.deepPartial().safeParse(data);
  if (parseResult.success === false) {
    console.warn('unparsable warning', url, JSON.stringify(params), parseResult.error, JSON.stringify(data));
    Sentry.Native.captureException(parseResult.error, {
      tags: {
        zod_error: true,
        center_id,
        zone_id,
        url,
      },
    });
    throw parseResult.error;
  } else {
    return {
      ...parseResult.data,
      zone_id: zone_id,
    };
  }
};

export default {
  queryKey,
  fetch: fetchAvalancheWarning,
  prefetch: prefetchAvalancheWarning,
};
