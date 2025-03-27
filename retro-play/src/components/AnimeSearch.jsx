import { useEffect, useState } from "react";
import { fetchAnimeSearch } from "../adapters/animeFetch";
import Pagination from "./PageChange";

function AnimeSearch({ searchQuery, setSearchQuery, currPage, setCurrPage }) {
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchQuery);

  const [hasNextPage, setHasNextPage] = useState(true);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const animeData = await fetchAnimeSearch(debouncedSearchTerm, currPage);

      // Checking
      console.log("Anime Search:", animeData);

      setSearchData(animeData.data);
      setHasNextPage(animeData.pagination.has_next_page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      handleSearch();
    }
  }, [debouncedSearchTerm, currPage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (debouncedSearchTerm !== "") {
      setCurrPage(1);
    }
    handleSearch();
  };

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchQuery(newSearchTerm);
  };

  return (
    <div className="anime-search-container">
      <h2>Search For Anime</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Anime"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="anime-grid">
            {searchData.map((anime, index) => (
              <div
                key={`${anime.mal_id}-${index}`}
                className="anime-grid-item"
                onClick={() => openModal(anime)}
              >
                <img src={anime.images.jpg.image_url} alt={anime.title} />
                <p>{anime.title}</p>
              </div>
            ))}
          </div>
          <Pagination
            currPage={currPage}
            setCurrPage={setCurrPage}
            hasNextPage={hasNextPage}
          />
        </>
      )}
    </div>
  );
}

export default AnimeSearch;
