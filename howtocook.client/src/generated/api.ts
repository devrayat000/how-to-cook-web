/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Area {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  name: string;
}

export interface AreaListResponse {
  items?: Area[] | null;
  metadata?: ListMetadata;
}

export interface AreaResponse {
  item?: Area;
}

export interface CategoryListResponse {
  items?: CategoryListResponseJson[] | null;
  metadata?: ListMetadata;
}

export interface CategoryListResponseJson {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  description: string;
  thumb?: string | null;
}

export interface CategoryResponse {
  item?: CategoryResponseJson;
}

export interface CategoryResponseJson {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  name: string;
  /** @minLength 1 */
  description: string;
  thumb?: string | null;
}

export interface Ingredient {
  /** @format int32 */
  id?: number;
  /** @minLength 1 */
  name: string;
  description?: string | null;
  type?: string | null;
}

export interface JsonRecipeIngredient {
  ingredient?: string | null;
  measure?: string | null;
}

export interface ListMetadata {
  /** @format int32 */
  count?: number;
  /** @format int32 */
  total?: number;
}

export interface RecipeListResponse {
  items?: RecipeListResponseJson[] | null;
  metadata?: ListMetadata;
}

export interface RecipeListResponseJson {
  /** @format int32 */
  id?: number;
  name?: string | null;
  /** @format uri */
  thumb?: string | null;
  category?: string | null;
  area?: string | null;
}

export interface RecipeResponse {
  item?: RecipeResponseJson;
}

export interface RecipeResponseJson {
  /** @format int32 */
  id?: number;
  name?: string | null;
  /** @format uri */
  thumb?: string | null;
  category?: string | null;
  area?: string | null;
  instructions?: string | null;
  ingredients?: JsonRecipeIngredient[] | null;
}

export interface WeatherForecast {
  /** @format date */
  date?: string;
  /** @format int32 */
  temperatureC?: number;
  /** @format int32 */
  temperatureF?: number;
  summary?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title HowToCook.Server
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Areas
     * @name AreasList
     * @request GET:/api/Areas
     */
    areasList: (params: RequestParams = {}) =>
      this.request<AreaListResponse, any>({
        path: `/api/Areas`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Areas
     * @name AreasDetail
     * @request GET:/api/Areas/{id}
     */
    areasDetail: (id: number, params: RequestParams = {}) =>
      this.request<AreaResponse, any>({
        path: `/api/Areas/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name CategoriesList
     * @request GET:/api/Categories
     */
    categoriesList: (
      query?: {
        /** @default "" */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CategoryListResponse, any>({
        path: `/api/Categories`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Categories
     * @name CategoriesDetail
     * @request GET:/api/Categories/{id}
     */
    categoriesDetail: (id: number, params: RequestParams = {}) =>
      this.request<CategoryResponse, any>({
        path: `/api/Categories/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ingredients
     * @name IngredientsList
     * @request GET:/api/Ingredients
     */
    ingredientsList: (params: RequestParams = {}) =>
      this.request<Ingredient[], any>({
        path: `/api/Ingredients`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Ingredients
     * @name IngredientsDetail
     * @request GET:/api/Ingredients/{id}
     */
    ingredientsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Ingredient, any>({
        path: `/api/Ingredients/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recipes
     * @name RecipesList
     * @request GET:/api/Recipes
     */
    recipesList: (
      query?: {
        /** @format int32 */
        Category?: number;
        /** @format int32 */
        Area?: number;
        /** @format int32 */
        Skip?: number;
        /** @format int32 */
        Limit?: number;
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RecipeListResponse, any>({
        path: `/api/Recipes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recipes
     * @name RecipesRandomList
     * @request GET:/api/Recipes/random
     */
    recipesRandomList: (
      query?: {
        /**
         * @format int32
         * @default 12
         */
        count?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RecipeListResponse, any>({
        path: `/api/Recipes/random`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recipes
     * @name RecipesDetail
     * @request GET:/api/Recipes/{id}
     */
    recipesDetail: (id: number, params: RequestParams = {}) =>
      this.request<RecipeResponse, any>({
        path: `/api/Recipes/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  weatherForecast = {
    /**
     * No description
     *
     * @tags WeatherForecast
     * @name GetWeatherForecast
     * @request GET:/WeatherForecast
     */
    getWeatherForecast: (params: RequestParams = {}) =>
      this.request<WeatherForecast[], any>({
        path: `/WeatherForecast`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
