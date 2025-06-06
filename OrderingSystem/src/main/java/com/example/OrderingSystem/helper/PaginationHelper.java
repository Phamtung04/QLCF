package com.example.OrderingSystem.helper;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import com.example.OrderingSystem.model.SideModel.Response;

public class PaginationHelper {

        public static <T> Response<List<T>> paginate(List<T> source, Integer page, Integer limit) {
                if (source == null) {
                        throw new IllegalArgumentException("Source cannot be null");
                }

                page = (page == null || page <= 0) ? 1 : page;
                limit = (limit == null || limit <= 0) ? source.size() : limit;

                int startIndex = (page - 1) * limit;
                List<T> paginatedData = source.stream()
                                .skip(startIndex)
                                .limit(limit)
                                .collect(Collectors.toList());

                return new Response<>(
                                true,
                                paginatedData,
                                "Lấy dữ liệu thành công",
                                limit == 0 ? 0 : (int) Math.ceil((double) source.size() / limit),
                                page,
                                limit);
        }

        public static <T> Response<T> paginate(T source, String result) {
                return new Response<>(
                                true,
                                source,
                                result,
                                1,
                                1,
                                1);
        }

        public static <T> Response<List<T>> paginate(Iterable<T> source) {
                List<T> listSource = StreamSupport.stream(source.spliterator(), false)
                                .collect(Collectors.toList());

                return new Response<>(
                                true,
                                listSource,
                                "Lấy dữ liệu thành công",
                                1,
                                1,
                                listSource.size());
        }

        public static <T> Response<T> error(T source, String result) {
                return new Response<>(
                                false,
                                source,
                                result,
                                1,
                                1,
                                1);
        }

        public static <T> Response<List<T>> error(List<T> source, String result) {
                return new Response<>(
                                false,
                                source,
                                result,
                                1,
                                1,
                                1);
        }
}
