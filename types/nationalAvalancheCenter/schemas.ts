// Generated by ts-to-zod
import {z} from 'zod';

import {
  AvalancheCenterType,
  AvalancheForecastZoneStatus,
  AvalancheProblemLikelihood,
  AvalancheProblemLocation,
  AvalancheProblemName,
  AvalancheProblemType,
  DangerLevel,
  ForecastPeriod,
  MediaType,
  ProductStatus,
  ProductType,
  Units,
} from './enums';

export const avalancheCenterIDSchema = z.enum([
  'BTAC', // Bridger-Teton: ID, WY
  'CNFAIC', // Chugach: AK
  'FAC', // Flathead: MT
  'GNFAC', // Gallatin: MT, WY, ID
  'IPAC', // Idaho Panhandle: ID, MT
  'NWAC', // Northwest: WA, OR
  'MSAC', // Mount Shasta: CA
  'MWAC', // Mount Washington: NH
  'PAC', // Payette: ID
  'SNFAC', // Sawtooths: ID
  'SAC', // Sierra: CA
  'WCMAC', // West Central Montana: MT
  'CAIC', // Colorado: CO
  'COAA', // Central Oregon: OR
  'CBAC', // Crested Butte: CO
  'ESAC', // Eastern Sierra: CA
  'WAC', // Wallowas: OR
]);
export type AvalancheCenterID = z.infer<typeof avalancheCenterIDSchema>;

export const dangerLevelSchema = z.nativeEnum(DangerLevel);

// coordinates encodes a list of points, each as a two-member array [longitude,latitude]
// for a type=Polygon, this a three-dimensional array number[][][]
// for a type=MultiPolygon, this a four-dimensional array number[][][][]
export const polygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number()))),
});

export const multiPolygonSchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(z.array(z.number())))),
});

export const featureComponentSchema = z.union([polygonSchema, multiPolygonSchema]);
export type FeatureComponent = z.infer<typeof featureComponentSchema>;

export const productTypeSchema = z.nativeEnum(ProductType);

export const productStatusSchema = z.nativeEnum(ProductStatus);

export const avalancheProblemTypeSchema = z.nativeEnum(AvalancheProblemType);

export const avalancheProblemNameSchema = z.nativeEnum(AvalancheProblemName);

export const avalancheProblemLikelihoodSchema = z.nativeEnum(AvalancheProblemLikelihood);

export const avalancheProblemLocationSchema = z.nativeEnum(AvalancheProblemLocation);

// Fix up data issues before parsing
// 1) NWAC (and probably others) return strings for avalanche problem size, not numbers
export const avalancheProblemSizeSchema = z
  .number()
  .or(z.string())
  .transform((val: string, ctx) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Avalanche problem size must be numeric, got: ${val}.`,
      });
      return z.NEVER;
    }
    return parsed;
  });

export const forecastPeriodSchema = z.nativeEnum(ForecastPeriod);

export const mediaTypeSchema = z.nativeEnum(MediaType);

export const mediaLinksSchema = z
  .object({
    large: z.string().optional(),
    medium: z.string().optional(),
    original: z.string().optional(),
    thumbnail: z.string().optional(),
  })
  .or(z.string().transform((_: string) => null)) // when this field is not populated, it's an empty string, not a null
  .nullable();

export const avalancheCenterMetadataSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  url: z.string().optional(),
  city: z.string().optional().nullable(),
  state: z.string().optional(),
});

export const avalancheForecastZoneSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  state: z.string().optional(),
  zone_id: z.union([z.number(), z.string()]).transform((val: number) => {
    return String(val);
  }),
});
export type AvalancheForecastZoneSummary = z.infer<typeof avalancheForecastZoneSummarySchema>;

export const avalancheCenterTypeSchema = z.nativeEnum(AvalancheCenterType);

export const latLngSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const avalancheCenterForecastWidgetTabSchema = z.object({
  name: z.string(),
  id: z.string(),
  url: z.string(),
});

export const avalancheCenterDangerMapWidgetConfigurationSchema = z.object({
  height: z.union([z.string(), z.number()]),
  saturation: z.union([z.string(), z.number()]),
  search: z.boolean(),
  geolocate: z.boolean(),
  advice: z.boolean(),
  center: latLngSchema,
  zoom: z.number(),
});

export const unitsSchema = z.nativeEnum(Units);

export const externalModalLinkSchema = z.object({
  link_name: z.string().optional(),
  area_plots: z.string().optional(),
  area_tables: z.string().optional(),
});

export const avalancheForecastZoneStatusSchema = z.nativeEnum(AvalancheForecastZoneStatus);

export const elevationBandNamesSchema = z.object({
  lower: z.string(),
  middle: z.string(),
  upper: z.string(),
});
export type ElevationBandNames = z.infer<typeof elevationBandNamesSchema>;

export const nationalWeatherServiceZoneSchema = z.object({
  id: z.number(),
  zone_name: z.string(),
  zone_id: z.string(),
  state: z.string(),
  city: z.string(),
  contact: z.string().nullable(), // CNFAIC (and others?) return null
  zone_state: z.string(),
});

export const avalancheDangerForecastSchema = z.object({
  lower: dangerLevelSchema.nullable(),
  middle: dangerLevelSchema.nullable(),
  upper: dangerLevelSchema.nullable(),
  valid_day: forecastPeriodSchema,
});
export type AvalancheDangerForecast = z.infer<typeof avalancheDangerForecastSchema>;

export const mediaItemSchema = z.object({
  id: z.number().optional(),
  url: mediaLinksSchema,
  type: mediaTypeSchema,
  caption: z.string(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const avalancheCenterWeatherConfigurationSchema = z.object({
  autofill: z.any(),
  // as of 2022-12-13, zone_id is a string in production and a number in staging
  zone_id: z.union([z.number(), z.string()]).transform((val: number) => {
    return String(val);
  }),
  // as of 2022-12-13, always present in production and undefined in staging
  forecast_point: z.optional(latLngSchema),
  forecast_url: z.any(),
});

export const avalancheCenterForecastWidgetConfigurationSchema = z.object({
  color: z.string(),
  elevInfoUrl: z.string(),
  glossary: z.boolean(),
  tabs: z.array(avalancheCenterForecastWidgetTabSchema),
});

export const avalancheCenterStationsWidgetConfigurationSchema = z.object({
  center: latLngSchema,
  zoom: z.number(),
  center_id: z.string(),
  alternate_zones: z.any(),
  units: unitsSchema,
  timezone: z.string(),
  color_rules: z.boolean(),
  source_legend: z.boolean(),
  sources: z.array(z.string()),
  within: z.union([z.string(), z.number()]),
  external_modal_links: z.union([z.record(externalModalLinkSchema), z.array(externalModalLinkSchema)]).optional(),
  token: z.string(),
});

export const avalancheForecastZoneConfigurationSchema = z.object({
  elevation_band_names: elevationBandNamesSchema,
});

export const avalancheProblemSchema = z.object({
  id: z.number(),
  forecast_id: z.number(),
  rank: z.number(),
  avalanche_problem_id: avalancheProblemTypeSchema,
  name: avalancheProblemNameSchema,
  likelihood: avalancheProblemLikelihoodSchema,
  location: z.array(avalancheProblemLocationSchema),
  size: z.array(avalancheProblemSizeSchema),
  discussion: z.string().nullable(),
  problem_description: z.string(),
  icon: z.string(),
  media: mediaItemSchema.nullable(),
});
export type AvalancheProblem = z.infer<typeof avalancheProblemSchema>;

export const avalancheCenterConfigurationSchema = z.object({
  // expires_time and published_time seem to be fractional hours past midnight, in the locale
  expires_time: z.number().optional().nullable(),
  published_time: z.number().optional().nullable(),
  blog: z.boolean().optional(),
  weather_table: z.array(avalancheCenterWeatherConfigurationSchema).optional(),
  zone_order: z.array(z.number()).optional(),
});

export const avalancheCenterWidgetConfigurationSchema = z.object({
  // CNFAIC (and others?) isn't returning forecast or danger_map
  forecast: avalancheCenterForecastWidgetConfigurationSchema.optional(),
  danger_map: avalancheCenterDangerMapWidgetConfigurationSchema.optional(),
  // GNFAC: missing stations
  stations: avalancheCenterStationsWidgetConfigurationSchema.optional(),
});

export const avalancheForecastZoneSchema = z.object({
  id: z.number(),
  name: z.string(),
  // SAC: zone is null
  url: z.string().nullable(),
  zone_id: z.string(),
  config: avalancheForecastZoneConfigurationSchema
    .or(
      z.string().transform((val: string) => {
        // 1) CAIC is returning malformed JSON for zone config - looks over-escaped
        return avalancheForecastZoneConfigurationSchema.parse(JSON.parse(val));
      }),
    )
    .nullable(),
  status: avalancheForecastZoneStatusSchema,
  rank: z.number().nullable(),
});
export type AvalancheForecastZone = z.infer<typeof avalancheForecastZoneSchema>;

export const productSchema = z.object({
  id: z.number(),
  product_type: productTypeSchema,
  status: productStatusSchema,
  author: z.string().nullable(),
  published_time: z.string().nullable(),
  expires_time: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
  announcement: z.string().optional().nullable(),
  bottom_line: z.string().nullable(),
  forecast_avalanche_problems: z.array(avalancheProblemSchema).optional(),
  hazard_discussion: z.string().optional().nullable(),
  danger: z.array(avalancheDangerForecastSchema),
  weather_discussion: z.string().optional().nullable(),
  weather_data: z.any(),
  media: z.array(mediaItemSchema).optional().nullable(),
  avalanche_center: avalancheCenterMetadataSchema,
  forecast_zone: z.array(avalancheForecastZoneSummarySchema),
});
export type Product = z.infer<typeof productSchema>;

export const productArraySchema = z.array(productSchema);
export type ProductArray = z.infer<typeof productArraySchema>;

export const avalancheCenterSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  city: z.string().nullable().optional(),
  state: z.string(),
  timezone: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  config: avalancheCenterConfigurationSchema.nullable(),
  type: avalancheCenterTypeSchema.nullable(),
  widget_config: avalancheCenterWidgetConfigurationSchema.nullable(),
  created_at: z.string(),
  zones: z.array(avalancheForecastZoneSchema),
  nws_zones: z.array(nationalWeatherServiceZoneSchema),
  nws_offices: z.array(z.string()),
  web_geometry: z.any(),
  center_point: z.any(),
  off_season: z.boolean(),
});
export type AvalancheCenter = z.infer<typeof avalancheCenterSchema>;

export const warningSchema = z.object({
  // CAIC returns strings here: https://api.avalanche.org/v2/public/products/map-layer/CAIC
  product: z.union([productSchema, z.string()]).nullable(),
});

// FeatureProperties contains three types of metadata about the forecast zone:
// - static information like the name of the zone and timezone
// - dynamic information like the current forecast and travel advice
// - consumer directions for how to render the feature, like fill color & stroke
export const featurePropertiesSchema = z.object({
  name: z.string(),
  center_id: avalancheCenterIDSchema,
  center_link: z.string(),
  state: z.string(),
  link: z.string(),
  off_season: z.boolean(),
  travel_advice: z.string(),
  danger: z.string(),
  danger_level: dangerLevelSchema,
  // start_date and end_date are RFC3339 timestamps that bound the current forecast
  // They're null for CNFAIC
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  warning: warningSchema,
  color: z.string(),
  stroke: z.string(),
  font_color: z.string(),
  fillOpacity: z.number(),
  fillIncrement: z.number(),
});

// Feature is a representation of a forecast zone
export const featureSchema = z.object({
  type: z.string(),
  id: z.number(),
  properties: featurePropertiesSchema,
  geometry: featureComponentSchema,
});
export type Feature = z.infer<typeof featureSchema>;

// MapLayer describes forecast zones to be drawn for an avalanche center
export const mapLayerSchema = z.object({
  type: z.string(),
  features: z.array(featureSchema),
});
export type MapLayer = z.infer<typeof mapLayerSchema>;
