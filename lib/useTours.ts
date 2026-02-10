import { useEffect, useMemo, useState } from "react";

export type TourItem = {
  id: string;
  title: string;
  country: string;
  city: string;
  country_local?: string | null;
  city_local?: string | null;
  start_date: string;
  end_date: string;
  adults_min: number;
  adults_max: number;
  price_from: number;
  nights: number;
  image_url: string;
  is_hot: number;
  tour_type?: string;
  gallery_urls?: string[];
};

export function useTours(lang?: string) {
  const [tours, setTours] = useState<TourItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const params = new URLSearchParams();
    if (lang) {
      params.set("lang", lang);
    }
    const url = params.toString() ? `/api/tours?${params.toString()}` : "/api/tours";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) {
          return;
        }
        setTours(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        if (isActive) {
          setTours([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [lang]);

  const hotTours = useMemo(
    () =>
      tours.filter(
        (tour) => tour.is_hot === 1 || tour.tour_type === "hot"
      ),
    [tours]
  );

  return { tours, hotTours, loading };
}
