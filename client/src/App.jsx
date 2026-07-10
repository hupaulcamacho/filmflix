import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ filmList, setFilmList ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  const fetchFilms = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok) {
        throw new Error('Failed to fetch films');
      }

      const data = await response.json();
      if(data.Response === "False") {
        setErrorMessage(data.Error || 'Failed to fetch films');
        setFilmList([]);
        return;
      }
      setFilmList(data.results || [])
    } catch (error) {
      console.error(`Error fetching films ${error}`)
      setErrorMessage('Error fetching films, please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFilms()
  }, [])

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner"/>
          <h1>Find <span className="text-gradient">Films</span> You'll Enjoy Without The Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Films</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {filmList.map((film) => (
                <p key={film.id} className="text-white">{film.title}</p>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
export default App
