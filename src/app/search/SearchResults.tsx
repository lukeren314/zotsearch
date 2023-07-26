import {
  Container,
  Loader,
  Space,
  Stack,
  Center,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Course } from "@prisma/client";
import InfiniteScroll from "react-infinite-scroller";
import CourseCard from "./CourseCard";

export default function SearchResults({
  loadMoreCourses,
  hasMoreCourses,
  searchResults,
  isLoading,
  isLoadingMore,
}: {
  loadMoreCourses: () => void;
  hasMoreCourses: boolean;
  searchResults: Course[];
  isLoading: boolean;
  isLoadingMore: boolean;
}) {
  return (
    <Container>
      {isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        searchResults.length > 0 ?
        <ScrollArea>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreCourses}
            hasMore={hasMoreCourses}
          >
            <Stack>
              {searchResults.map((course) => (
                <CourseCard course={course} key={course.id} />
              ))}
            </Stack>
            <Space h="md" />
            {isLoadingMore ? (
              <Center>
                <Loader />
              </Center>
            ) : null}
          </InfiniteScroll>
        </ScrollArea> : <Text ta="center">No results found!</Text>
      )}
    </Container>
  );
}
