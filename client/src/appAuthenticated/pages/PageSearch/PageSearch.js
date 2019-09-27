import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../../../contexts/AppContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import Slider from 'rc-slider';
import { faStar, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { actionLogout } from '../../../actions/authActions';

const genreList = [
    'All',
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Family',
    'Fantasy',
    'History',
    'Horror',
    'Music',
    'Musical',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Sport',
    'Thriller',
    'War',
    'Western'
]

const sortingList = [
    'rating',
    'year',
    'title'
]

const MainSection = styled.section `
    background-color:#202020;
    padding:1.5rem;
    min-height:100vh;
`

const TermsContainer = styled.section `
    display:grid;
    grid-template-columns:repeat(6, 1fr);
    grid-template-rows:auto auto;
    grid-column-gap:1.5rem;
    grid-row-gap:1.5rem;
    grid-template-areas:
    'search search search genre order sort'
    'rating rating rating year year year';
    @media (max-width: 1000px) {
        grid-template-columns:auto;
        grid-template-rows:auto;
        grid-template-areas:
        'search'
        'genre'
        'order'
        'sort'
        'rating'
        'year'
    }
    padding: 0 1.5rem;
`

const StyledLabel = styled.label `
    color:#C50C15;
    font-weight:bold;
    margin-right:1.5rem;
    font-size:1.5rem;
`

const StyledTextField = styled(TextField) `
    label {
        color:#C50C15;
        font-size:1.75rem;
        font-weight:bold;
    }
    div {
        color:white;
        option { color:#202020; }
    }
    svg { color: #C50C15; }
    select { font-weight:bold; }
`

const GenreSelect = styled(StyledTextField) ` grid-area:genre; `
const SortSelect = styled(StyledTextField) ` grid-area:sort; `
const OrderSelect = styled(StyledTextField) ` grid-area:order; `
const YearRangeContainer = styled.div ` grid-area:year; padding:0 0.75rem; `
const RatingRangeContainer = styled.div ` grid-area:rating; padding:0 0.75rem; `

const StyledSearchInput = styled(StyledTextField) `
    grid-area: search;
    div { color:white; }
`

const StyledH2 = styled.h2 `
    text-align:center;
    color:white;
    font-size:3rem;
`

const MoviesContainer = styled.section `
    margin:0.5rem 0 3rem 0;
    display:grid;
    grid-template-columns: repeat( auto-fill, 225px );
    grid-column-gap:5px;
    grid-row-gap:1rem;
    justify-content:center;
`

const MovieThumbnail = props => {

    const title = props.movie.title.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' ');

    const Thumbnail = styled.div `
        background-image:url(${props => props.cover});
        height:338px;
        width:225px;
        background-size:cover;
        position:relative;
        :hover { 
            cursor:pointer
            .hover { visibility:visible; }
            .viewed { display:none; }
        }
    `

    const HoverMask = styled.div `
        height:100%;
        width:100%;
        background-color: rgba(0, 0, 0, 0.75);
        padding:1rem;
        box-sizing:border-box;
        display:flex;
        flex-direction:column;
        visibility:hidden;
        align-items:center;
        justify-content:center;
    `

    const ViewedMask = styled.div `
        position:relative;
        height:100%;
        width:100%;
        background-color: rgba(0, 0, 0, 0.75);
        padding:1rem;
        box-sizing:border-box;
    `

    const Title = styled.h3 `
        font-size:1.5rem;
        color:white;
        margin:0;
        text-align:center;
    `

    const Year = styled.span `
        color:white;
        margin:0;
        font-weight:bold;
        text-decoration:none;
        padding: 0.25rem 0.5rem;
        :not(:last-child) { 
            border-right:1px solid white;
        }
    `

    const Rating = styled.p`
        position: relative;
        ::before, ::after {
          position: absolute;
          left: 20%;
          opacity: 0;
          background-color: dimgray;
          border-radius: 5px;
          padding: 4px;
          text-align: center;
        }
        :hover::before, :hover::after {
          opacity: 1;
        }
        ::after {
          content: attr(data-tooltip);
          transform: translateY(-120%);
        }
    `;

    const FullStar = styled(FontAwesomeIcon)`
      color: #E8BB1A;
    `;
    const EmptyStar = styled(FontAwesomeIcon)`
      color: dimgray;
    `;

    const StyledIcon = styled(FontAwesomeIcon) `
        color:#C50C15;
        position:absolute;
        right:15px;
        top:15px;
        z-index:1000;
    `
    return (
        <Thumbnail cover={props.movie.poster}>
                {props.viewed && <StyledIcon icon={faEye} size={'lg'}/>}
                {props.viewed && <ViewedMask className="viewed"></ViewedMask>}
                <HoverMask className="hover">
                    <Title>{title}</Title>
                    <Rating data-tooltip={`${props.movie.rating}/5`}>
                      {props.movie.rating > 0.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                      {props.movie.rating > 1.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                      {props.movie.rating > 2.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                      {props.movie.rating > 3.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                      {props.movie.rating > 4.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                    </Rating>
                    <div>
                        <Year>{props.movie.year}</Year>
                        {props.movie.runtime !== 0 && <Year>{props.movie.runtime} minutes</Year>}
                    </div>
                </HoverMask>
        </Thumbnail>
    )
}

export default function PageSearch() {

    const {t,  toggleConnected } = useContext(AppContext);
    const [viewedList, setViewedList] = useState({list: []});
    const [searchTerms, setSearchTerms] = useState({
        genre: "All",
        page: 1,
        order:  -1,
        sort: "year",
        ratings: [0, 5],
        years: [1915, 2019],
        keywords: "",
        limit: 50
    })
    const [searchResult, setSearchResult] = useState({movies: []});
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        let isSubscribed = true;
        const fetchUserdata = async () => {
            try {
                const res = await axios.get(`/users?authToken=${authToken}`);
                if (isSubscribed) setViewedList({ list: [...res.data.user.viewedList]});
            } catch(err) {
                console.log(err);
                if (err.response && err.response.status === 401) actionLogout(toggleConnected);
            }
        };
        if (authToken) fetchUserdata();
        return () => isSubscribed = false;
    }, [authToken, toggleConnected])

    useEffect(() => {
        let isSubscribed = true;
        const fetchMovies = async () => {
            try {
                const res = await axios.post(`/search/genre?authToken=${authToken}`, searchTerms);
                const test = res.data;
                if (isSubscribed && res.data.length !== 0) {
                    if (searchTerms.page === 1) setSearchResult({ movies: [...test] })
                    else setSearchResult(prev => ({movies: prev.movies.concat(test)}))
                }
            } catch(err) {
                if (err.response && err.response.status === 401) actionLogout(toggleConnected);
            }
        }
        if (authToken) fetchMovies();
        return () => isSubscribed = false;
    }, [searchTerms, toggleConnected, authToken])

    const handleTermsChange = event => {
        setSearchTerms({
            ...searchTerms,
            page: 1,
            [event.target.name]: event.target.value,
        })
    }

    const handleGenreChanges = event => {
        setSearchTerms({
            ...searchTerms,
            genre: event.target.value,
            page: 1,
            order:  -1,
            sort: "year",
            ratings: [0, 5],
            years: [1915, 2019],
            limit: 50,
            keywords:""
        })
    }
    const handleRatingsChanges = value => {
        setSearchTerms({
            ...searchTerms,
            page: 1,
            ratings: value
        })
    }

    const handleYearsChanges = value => {
        setSearchTerms({
            ...searchTerms,
            page: 1,
            years: value
        })
    }

    const handleSearchInput = event => {
        setSearchResult({movies: []})
        setSearchTerms({
            ...searchTerms,
            sort:'title',
            order: 1,
            page: 1,
            ratings: [0, 5],
            years: [1915, 2019],
            keywords: event.target.value,
            limit: 50
        })
    }

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    const StyledRange = styled(Range) `
        margin-top:1rem;
        .rc-slider-track { background-color: #bd4b51; }
        .rc-slider-handle { 
            border-color:white;
            :hover { border-color:#C50C15; }
            :active { 
                box-shadow:0 0 5px #C50C15;
                border-color:#C50C15;
            }
        }
    `

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        setSearchTerms(p => {
            const terms = {
                ...p,
                page: p.page + 1
            }
            return terms
        })
        return
    }

    return (
        <MainSection>
            <TermsContainer>
                <StyledSearchInput
                    label={t.search.searchTitle}
                    value={searchTerms.keywords}
                    onChange={handleSearchInput}
                    variant="outlined"
                    placeholder="10 Cloverfield Lanes, Hereditary, ..."
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
                <GenreSelect
                    select
                    label={t.search.genre}
                    name="genre"
                    value={searchTerms.genre}
                    onChange={handleGenreChanges}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                    >
                    {genreList.map(genre => (
                        <option key={genre} value={genre}>
                            {t.search[genre.toLowerCase()]}
                        </option>
                    ))}
                </GenreSelect>
                <SortSelect
                    select
                    label={t.search.sort}
                    name="sort"
                    value={searchTerms.sort}
                    onChange={handleTermsChange}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                    >
                    {sortingList.map(sorting => (
                        <option key={sorting} value={sorting.toLowerCase()}>
                            {t.search[sorting].charAt(0).toUpperCase() + t.search[sorting].slice(1)}
                        </option>
                    ))}
                </SortSelect>
                <OrderSelect
                    select
                    label={t.search.order}
                    name="order"
                    value={searchTerms.order}
                    onChange={handleTermsChange}
                    SelectProps={{
                      native: true,
                    }}
                    variant="outlined"
                    >
                    <option value={-1}>{t.search.desc}</option>
                    <option value={1}>{t.search.asc}</option>
                </OrderSelect>
                <RatingRangeContainer>
                    <StyledLabel>
                        {t.search.rating.charAt(0).toUpperCase() + t.search.rating.slice(1)} ({searchTerms.ratings[0]} - {searchTerms.ratings[1]})
                    </StyledLabel>
                    <StyledRange 
                        onAfterChange={handleRatingsChanges}
                        min={0}
                        max={5}
                        allowCross={false}
                        defaultValue={searchTerms.ratings}
                        tipFormatter={value => `${value}`} 
                    />
                </RatingRangeContainer>
                <YearRangeContainer>
                    <StyledLabel>
                        {t.search.year} ({searchTerms.years[0]} - {searchTerms.years[1]})
                    </StyledLabel>
                    <StyledRange 
                        onAfterChange={handleYearsChanges}
                        min={1915}
                        max={2019}
                        allowCross={false}
                        defaultValue={searchTerms.years}
                        tipFormatter={value => `${value}`} 
                    />
                </YearRangeContainer>
            </TermsContainer>
            <StyledH2>{t.search[searchTerms.genre.toLocaleLowerCase()]}</StyledH2>
            <MoviesContainer>
                {searchResult.movies.map((movie, index) => 
                    <Link to={`/movies/${movie.imdbId}`} style={{textDecoration:'none'}} key={index}>
                        <MovieThumbnail movie={movie} viewed={viewedList.list.includes(movie.imdbId)}/>
                    </Link>
                )}
            </MoviesContainer>
        </MainSection>
    )
}