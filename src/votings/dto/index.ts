export type QueryDpdParam = {
  province_id: number;
};

export type QueryDprdParam = QueryDpdParam & {
  city_id: number;
};
