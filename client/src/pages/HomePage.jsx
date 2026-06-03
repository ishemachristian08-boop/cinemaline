import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchMovies, fetchScreenings } from '../services/api';
import toast from 'react-hot-toast';
import Icon from '../components/Icon';

const GENRES = ['All', 'Sci-Fi', 'Action', 'Drama', 'Fantasy', 'Comedy'];

/** Build date options starting today for next 7 days */
const buildDateOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const iso = d.toISOString().split('T')[0];
        const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow'
            : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        options.push({ label, value: iso });
    }
    return options;
};

const DATE_OPTIONS = buildDateOptions();

const isScreeningClosed = (screening) => {
    const todayIso = new Date().toISOString().split('T')[0];
    if (screening.date !== todayIso) return false;
    if (!screening.time) return false;
    try {
        const [timePart, meridiem] = screening.time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        const now = new Date();
        const screeningStart = new Date();
        screeningStart.setHours(hours, minutes || 0, 0, 0);
        return (now - screeningStart) > 30 * 60 * 1000;
    } catch { return false; }
};

const FORMAT_COLORS = {
    'IMAX': 'var(--primary)',
    'Dolby Cinema': '#be123c',
    '4DX': '#f59e0b',
    '3D': '#10b981',
    '2D': '#9ca3af',
};

const MovieSkeleton = () => (
    <div className="movie-card movie-card--skeleton">
        <div className="movie-poster movie-poster--skeleton" />
        <div className="movie-meta">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--subtitle" />
            <div className="skeleton-line skeleton-line--button" />
        </div>
    </div>
);

export default function HomePage() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

    // Showtime modal state
    const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[0].value);
    const [screenings, setScreenings] = useState([]);
    const [loadingScreenings, setLoadingScreenings] = useState(false);
    // Trailer modal state
    const [trailerMovie, setTrailerMovie] = useState(null);

    const navigate = useNavigate();
    const { setScreening } = useCart();

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setTrailerMovie(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Load movies
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchMovies();
                setMovies(data);
            }
            catch {
                toast.error('Failed to load movies');
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Auto-advance hero carousel
    useEffect(() => {
        if (movies.length === 0) return;
        const id = setInterval(() => setCurrentHeroIndex(p => (p + 1) % Math.min(movies.length, 3)), 7000);
        return () => clearInterval(id);
    }, [movies]);

    // Load screenings
    const loadScreenings = useCallback(async (movieId, date) => {
        setLoadingScreenings(true);
        try {
            const data = await fetchScreenings({ movieId, date });
            setScreenings(data);
        } catch {
            const movie = movies.find(m => m.id === movieId);
            setScreenings(movie?.screenings || []);
        } finally {
            setLoadingScreenings(false);
        }
    }, [movies]);

    useEffect(() => {
        if (selectedMovie) loadScreenings(selectedMovie.id, selectedDate);
    }, [selectedMovie, selectedDate, loadScreenings]);

    const filtered = selectedGenre === 'All' ? movies : movies.filter(m => m.genre === selectedGenre);

    const handleSelectScreening = (screening) => {
        if (isScreeningClosed(screening)) return;
        setScreening({
            id: screening.id,
            movie: selectedMovie.title,
            poster: selectedMovie.poster,
            date: screening.date,
            time: screening.time,
            hall: screening.hall,
            format: screening.format,
            basePrice: screening.basePrice || 12,
        });
        navigate(`/select-seats/${screening.id}`);
        setSelectedMovie(null);
    };

    const openModal = (movie) => {
        setSelectedMovie(movie);
        setSelectedDate(DATE_OPTIONS[0].value);
    };

    return (
        <div className="home-page">
            {/* ── Hero Carousel ── */}
            {!loading && movies.length > 0 && (
                <section className="hero section--flush" aria-label="Now playing">
                    {movies.slice(0, 3).map((movie, index) => (
                        <div
                            key={movie.id}
                            className={`hero__slide ${index === currentHeroIndex ? 'hero__slide--active' : ''}`}
                            aria-hidden={index !== currentHeroIndex}
                        >
                            <img
                                src={movie.poster}
                                alt=""
                                className="hero__image"
                                loading={index === 0 ? 'eager' : 'lazy'}
                            />
                            <div className="hero__overlay-left" />
                            <div className="hero__overlay-bottom" />
                            <div className="hero__content">
                                <div className="hero__kicker">
                                    <span className="hero__kicker-dot" />
                                    Now Playing
                                </div>
                                <h1 className="hero__title">{movie.title}</h1>
                                <div className="hero__meta">
                                    <span className="hero__rating">{movie.rating}</span>
                                    <span className="hero__genre">{movie.genre}</span>
                                    <span className="hero__duration">|</span>
                                    <span className="hero__duration">{movie.duration}</span>
                                </div>
                                <p className="hero__description">{movie.description}</p>
                                <div className="hero__actions">
                                    <button className="btn btn--primary" onClick={() => openModal(movie)} aria-label={`Book tickets for ${movie.title}`}>
                                        <Icon name="local_activity" size="btn" />
                                        <span className="btn-label">Get Tickets</span>
                                    </button>
                                    {movie.trailerId && (
                                        <button className="btn btn--secondary" onClick={() => setTrailerMovie(movie)} aria-label={`Watch trailer for ${movie.title}`}>
                                            <Icon name="play_circle" size="btn" />
                                            <span className="btn-label">Watch Trailer</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="carousel-indicators" role="tablist" aria-label="Hero carousel">
                        {movies.slice(0, 3).map((_, idx) => (
                            <button
                                key={idx}
                                className={`carousel-dot ${currentHeroIndex === idx ? 'carousel-dot--active' : ''}`}
                                onClick={() => setCurrentHeroIndex(idx)}
                                aria-label={`Slide ${idx + 1}`}
                                aria-selected={currentHeroIndex === idx}
                                role="tab"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ── Genre Filter ── */}
            <section className="genre-section section--sm container">
                <div className="section-header">
                    <h2 className="section-title">Explore Experience</h2>
                </div>
                <div className="genre-filters" role="tablist" aria-label="Filter by genre">
                    {GENRES.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`btn ${selectedGenre === genre ? 'btn--primary' : 'btn--ghost'} genre-btn`}
                            aria-pressed={selectedGenre === genre}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Movie Grid ── */}
            <section className="movies-section section container" aria-label="Movie listings">
                {loading ? (
                    <div className="movie-grid">
                        {Array(6).fill(0).map((_, i) => <MovieSkeleton key={i} />)}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="movie-grid">
                        {filtered.map(movie => (
                            <article
                                key={movie.id}
                                className="movie-card"
                                onClick={() => openModal(movie)}
                                aria-labelledby={`movie-${movie.id}-title`}
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && openModal(movie)}
                            >
                                <div className="movie-poster">
                                    <img src={movie.poster} alt={movie.title} loading="lazy" />
                                    <div className="movie-rating">{movie.rating}</div>
                                    <div className="movie-poster-overlay" />
                                </div>
                                <div className="movie-meta">
                                    <h3 id={`movie-${movie.id}-title`} className="movie-title">{movie.title}</h3>
                                    <div className="movie-info">
                                        <Icon name="movie" size="sm" aria-hidden="true" />
                                        <span>{movie.genre.toUpperCase()}</span>
                                        <span className="movie-info__separator">·</span>
                                        <span>{movie.duration}</span>
                                    </div>
                                    <p className="movie-desc">{movie.description}</p>
                                    <button className="btn btn--primary">
                                        <Icon name="confirmation_number" size="btn" />
                                        <span className="btn-label">Book Experience</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="material-symbols-outlined empty-icon">search_off</span>
                        <h3 className="empty-title">No Movies Scheduled</h3>
                        <p className="empty-text">There are no screenings matching the selected category.</p>
                    </div>
                )}
            </section>

            {/* ── Showtime Modal ── */}
            {selectedMovie && (
                <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedMovie(null)}>
                    <div className="modal-content" role="dialog" aria-modal="true" aria-label={`${selectedMovie.title} showtimes`}>
                        <div className="modal-header">
                            <img src={selectedMovie.poster} alt="" className="modal-poster" />
                            <div className="modal-movie-info">
                                <h3 className="modal-title">{selectedMovie.title}</h3>
                                <div className="modal-meta">
                                    <span className="modal-rating">{selectedMovie.rating}</span>
                                    <span className="modal-details">{selectedMovie.genre} · {selectedMovie.duration}</span>
                                </div>
                                <p className="modal-description">{selectedMovie.description}</p>
                            </div>
                        </div>

                        <div className="modal-date-section">
                            <p className="modal-label">Select Screening Date</p>
                            <div className="date-filters" role="tablist" aria-label="Select screening date">
                                {DATE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setSelectedDate(opt.value)}
                                        className={`btn ${selectedDate === opt.value ? 'btn--primary' : 'btn--ghost'} date-btn`}
                                        aria-pressed={selectedDate === opt.value}
                                    >
                                        {opt.label.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="screenings-section">
                            {loadingScreenings ? (
                                <div className="loading-spinner">
                                    <span className="spinner" />
                                </div>
                            ) : screenings.length === 0 ? (
                                <div className="no-screenings">
                                    <Icon name="calendar_today" size="lg" />
                                    <p>No screenings scheduled for this date.</p>
                                </div>
                            ) : (
                                <div className="screenings-grid">
                                    {screenings.map(s => {
                                        const closed = isScreeningClosed(s);
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => !closed && handleSelectScreening(s)}
                                                disabled={closed}
                                                className={`screening-card ${closed ? 'closed' : ''}`}
                                            >
                                                <div className="screening-time">{s.time}</div>
                                                <div className="screening-hall">{s.hall}</div>
                                                <div className="screening-details">
                                                    <span
                                                        className="screening-format"
                                                        style={{ background: FORMAT_COLORS[s.format] || '#6b7280' }}
                                                    >
                                                        {s.format}
                                                    </span>
                                                    {!closed && s.basePrice && (
                                                        <span className="screening-price">${s.basePrice.toFixed(0)}</span>
                                                    )}
                                                </div>
                                                {closed && <div className="screening-closed-overlay">Closed</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setSelectedMovie(null)} className="btn btn--ghost">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trailer Modal */}
            {trailerMovie && (
                <div onClick={() => setTrailerMovie(null)} className="modal-overlay trailer-overlay">
                    <div onClick={e => e.stopPropagation()} className="trailer-modal">
                        <div className="trailer-video-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailerMovie.trailerId}?autoplay=1&rel=0&modestbranding=1`}
                                title={`${trailerMovie.title} Trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="trailer-info">
                            <div>
                                <h4 className="trailer-title">{trailerMovie.title}</h4>
                                <p className="trailer-subtitle">Official Trailer · {trailerMovie.genre}</p>
                            </div>
                            <button
                                className="btn btn--primary"
                                onClick={() => { setTrailerMovie(null); openModal(trailerMovie); }}
                            >
                                Book Experience
                            </button>
                        </div>
                        <button
                            onClick={() => setTrailerMovie(null)}
                            className="btn btn--ghost trailer-close"
                            aria-label="Close trailer"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
