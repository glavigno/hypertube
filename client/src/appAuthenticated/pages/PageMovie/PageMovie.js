import React, { useState, useEffect, useContext, Fragment } from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';
import cloudinary from 'cloudinary-core';
import AppContext from '../../../contexts/AppContext';
import { actionLogout } from '../../../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'dif6rqidm'});

const Hero = styled.section`
  background-color: black;
  display: flex;
  color: white;
  font-family: Roboto;
  word-break: break-word;
  justify-content: center;
  position: relative;
  min-height: 100vh;
  @media (max-width: 1280px) {
    flex-direction: column;
  }
`;
const Poster = styled.img`
  @media (max-width: 1280px) {
    width: 300px;
  }
`;
const PosterSection = styled.section`
  padding: 50px;
  @media (max-width: 1280px) {
    padding: 0;
    padding-top: 15px;
    align-self: center;
  }
`;
const InfoSection = styled.section`
  padding: 50px;
  @media (max-width: 1280px) {
    padding: 0 10px;
    align-self: center;
    h1 {
      margin-top: 10px;
    }
  }
`;
const CloseIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  color: gray;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;
const CloseLink = styled(Link)`
  position: absolute;
  top: 20px;
  right: 30px;
`;
const Title = styled.h1`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 20px;
  max-width: 520px;
`;
const Info = styled.section`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 0.9em;
  @media (max-width: 1280px) {
    padding: 0;
    padding-top: 15px;
    align-self: center;
    font-size: 0.8em;
  }
`;
const Year = styled.p`
`;
const Runtime = styled.p`
`;
const Genre = styled.p`
  max-width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const ImdbLink = styled.a`
`;
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
const Plot = styled.p`
  margin-bottom: 50px;
  max-width: 520px;
`;
const TorrentSection = styled.section`
`;
const ProviderLogo = styled.img`
  width: 50px;
  margin: 50px 0 10px 0;
`;
const Magnet = styled.div`
  margin-bottom: 5px;
  background-color: #353535;
  border-radius: 3px;
  max-width: 500px;
  padding: 0 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  font-size: 0.9em;
  font-weight: bold;
  align-items: center;
  color: grey;
  cursor: pointer;
  :hover {
    background-color: #858585;
    color: white;
  }
`;
const Quality = styled.p`
`;
const Peers = styled.p`
`;
const Seeds = styled.p`
`;
const Size = styled.p`
`;
const PlayButton = styled(FontAwesomeIcon)`
  font-size: 1.2em;
  justify-self: center;
  color: #353535;
`;
const Separator = styled.div`
  width: 2px;
  height: 15px;
  border-right: solid 1px dimgray;
  margin: 0 20px;
  @media (max-width: 1280px) {
    margin: 0 5px;
  }
`;
const ImdbLogo = styled.img`
  width: 35px;
`;
const CommentsTitle = styled.h1`
  color: white;
  font-weight: 700;
  font-size: 1.6em;
  margin-top: 120px;
`;
const StyledTextField = styled(TextField) `
  label {
    color: ${props => props.theme.color.white};
    &.MuiFormLabel-root.Mui-focused {
      color: ${props => props.theme.color.white};
    }
  }
  div {
    color: ${props => props.theme.color.white};
    &::after {
      border-bottom: 2px solid ${props => props.theme.color.white};
    }
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SubmitButton = styled.button`
  text-decoration: none;
  cursor: pointer;
  border: none;
  text-align: center;
  padding: 1px;
  margin-top: 20px;
  background-color: black;
  width: 170px;
  border-radius: ${props => props.theme.borderRadius};
  color: ${props => props.theme.color.white};
  font-family: Roboto;
  font-size: 0.9em;
  font-weight: bold;
  &:hover {
    background-color: #C50C15;
  }
`;
const FormContainer = styled.section`
  max-width: 400px;
  padding: 0 50px 20px 50px;
  background-color: #353535;
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  h1 {
    font-size: 2rem;
    text-align: center;
    font-family: Roboto;
    color: ${props => props.theme.color.white};
  }
`;
const CommentsContainer = styled.section`
  margin-top: 100px;
`;
const Comment = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 5fr;
  grid-template-areas:
    "avatarThumb username date"
    "avatarThumb comment comment";
  width: 400px;
  background-color: black;
  box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.1);
  color: white;
  font-family: Roboto;
  padding: 10px 0;
`;
const AvatarThumb = styled.img`
  grid-area: avatarThumb;
  height: 45px;
  width: 45px;
  object-fit:cover;
  border-radius: 100%;
  background-color: black;
  cursor: pointer;
  justify-self: center;
`;
const Username = styled(Link)`
  grid-area: username;
  font-size: 0.8rem;
  font-weight: 700;
  align-self: center;
  color: gray;
  text-decoration: none;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;
const Date = styled.p`
  grid-area: date;
  align-self: center;
  color: dimgray;
  font-size: 0.8rem;
`;
const CommentText = styled.p`
  grid-area: comment;
  margin: 0 0 20px 0;
  word-break: break-word;
`;
const NotFoundSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NotFoundContainer = styled.div`
  border: solid 1px dimgray;
  border-radius: 5px;
  text-align: center;
  padding: 50px;
`;
const NotFoundTitle = styled.h1`
  color: white;
  font-size: 10em;
  font-weight: 100;
  font-family: Roboto;
  margin: 0;
`;
const NotFoundText = styled.p`

`;


export default function TestMovie(props) {

  const { t, toggleConnected, setCurrentMovieInfo } = useContext(AppContext);
  const authToken = localStorage.getItem('authToken');
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const [movieInfo, setMovieInfo] = useState(null);
  const [comment, setComment] = useState(null);
  const [commentError, setCommentError] = useState(false);
  const [commentHelper, setCommentHelper] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/comments/${props.match.params.imdbId}?authToken=${authToken}`);
        if (isSubscribed) setComments(res.data.comments);
      } catch(err) {
        console.log(err);
        if (err.response && err.response.status === 401) actionLogout(toggleConnected);
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken, toggleConnected, props.match.params.imdbId]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/movies/${props.match.params.imdbId}?authToken=${authToken}`);
        if (isSubscribed) {
          setMovieInfo(res.data.movieInfo[0]);
          setIsLoading(false);
        }
      } catch(err) {
        console.log(err);
        if (err.response && err.response.status === 401) actionLogout(toggleConnected);
      }
    };
    if (authToken) fetchData();
    return () => isSubscribed = false;
  }, [authToken, toggleConnected, props.match.params.imdbId]);

  const handleBlur = name => event => {
    const regex = /^[\w\W]{0,250}$/; 
    if (regex.test(String(comment))) {
      setComment(event.target.value);
      setCommentError(false);
      setCommentHelper(null);
    } else {
      setCommentError(true);
      setCommentHelper('You have max 250 characters');
    }
  };

  const handleChange = name => event => {
    const regex = /^[\w\W]{0,250}$/;
    if (regex.test(String(event.target.value))) {
      setComment(event.target.value);
      setCommentError(false);
      setCommentHelper(null);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const commentPayload = { 
        comment,
        imdbId: props.match.params.imdbId,
      };
      await axios.post(`/comments?authToken=${authToken}`, commentPayload);
      setComment(null);
      setCommentError(false);
      setCommentHelper(null);
      const resFetch = await axios.get(`/comments/${props.match.params.imdbId}?authToken=${authToken}`);
      setComments(resFetch.data.comments);
    } catch(err) {
      console.log(err);
      if (err.response && err.response.status === 401) actionLogout(toggleConnected);
    }
  };
  const launchStream = async magnet => {
     try {
      setCurrentMovieInfo({magnet, imdbId: props.match.params.imdbId});
      props.history.push(`/${props.match.params.imdbId}/stream`);
      const viewedPayload = { imdbId: props.match.params.imdbId };
      await axios.post(`/viewed?authToken=${authToken}`, viewedPayload);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <Hero>
      {!isLoading &&
      <Fragment>
        <CloseLink to="/search">
          <CloseIcon icon={faTimes}></CloseIcon>
        </CloseLink>
        {!movieInfo &&
          <NotFoundSection>
            <NotFoundContainer>
                <NotFoundTitle>404</NotFoundTitle>  
                <NotFoundText>Sorry but this film does not exist in our database</NotFoundText>  
            </NotFoundContainer>
          </NotFoundSection>
        }
        {movieInfo && 
          <Fragment>
            <PosterSection>
              <Poster src={movieInfo.poster}></Poster>
            </PosterSection>
            <InfoSection>
              <Title>{movieInfo.title.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}</Title>
              <Info>
                <Year>{movieInfo.year}</Year>
                {movieInfo.runtime !== 0 &&
                  <Fragment>
                    <Separator></Separator>
                    <Runtime>{movieInfo.runtime} {t.movie.minutes}</Runtime>
                  </Fragment>
                }
                <Separator></Separator>
                <Genre>{movieInfo.genres.join(' / ')}</Genre>
                <Separator></Separator>
                <ImdbLink target="_blank" href={`https://www.imdb.com/title/${props.match.params.imdbId}`}>
                  <ImdbLogo src={cloudinaryCore.url('imdb_logo')}></ImdbLogo>
                </ImdbLink>
                <Separator></Separator>
                <Rating data-tooltip={`${movieInfo.rating}/5`}>
                  {movieInfo.rating > 0.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                  {movieInfo.rating > 1.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                  {movieInfo.rating > 2.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                  {movieInfo.rating > 3.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                  {movieInfo.rating > 4.5 ? <FullStar icon={faStar}></FullStar> : <EmptyStar icon={faStar}></EmptyStar>}
                </Rating>
              </Info>
              <Plot>{movieInfo.plot}</Plot>
              <TorrentSection>
                {movieInfo.torrents.filter(magnet => magnet.source === 'Popcorn Time').length > 0 && 
                  <Fragment>
                    <ProviderLogo src={cloudinaryCore.url('popcornTime_logo')}></ProviderLogo>
                    {movieInfo.torrents.filter(magnet => magnet.source === 'Popcorn Time').map((magnet, index) => 
                      <Magnet key={index} onClick={() => launchStream(magnet)}>
                        <Seeds>Seeds: <span style={{color: '#51C148'}}>{magnet.seed}</span></Seeds>
                        <Peers>Peers: <span style={{color: '#D33838'}}>{magnet.peer}</span></Peers>
                        <Size>{magnet.fileSize}</Size>
                        <Quality>{magnet.quality}</Quality>
                        <PlayButton icon={faPlay}></PlayButton>
                      </Magnet>
                    )}
                  </Fragment>              
                }
                {movieInfo.torrents.filter(magnet => magnet.source === 'YTS').length > 0 &&
                <Fragment>
                  <ProviderLogo src={cloudinaryCore.url('yts_logo')}></ProviderLogo>
                  {movieInfo.torrents.filter(magnet => magnet.source === 'YTS').map((magnet, index) => 
                    <Magnet key={index} onClick={() => launchStream(magnet)}>
                      <Seeds>Seeds: <span style={{color: '#51C148'}}>{magnet.seed}</span></Seeds>
                      <Peers>Peers: <span style={{color: '#D33838'}}>{magnet.peer}</span></Peers>
                      <Size>{magnet.fileSize}</Size>
                      <Quality>{magnet.quality}</Quality>
                      <PlayButton icon={faPlay}></PlayButton>
                    </Magnet>
                  )}
                </Fragment>
                }
              </TorrentSection>
              <CommentsContainer>
                <CommentsTitle>{t.movie.comments}</CommentsTitle>
                {comments && comments.map(comment => 
                  <Comment key={comment.date}>
                    <AvatarThumb src={cloudinaryCore.url(comment.user.avatarPublicId)}></AvatarThumb>
                    <Username to={`/users/${comment.user.username}`}>{comment.user.username}</Username>
                    <Date></Date>
                    <CommentText>{comment.comment}</CommentText>
                  </Comment>
                )}
              </CommentsContainer>
              <FormContainer>
                <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                  <StyledTextField
                    id="standard-comment"
                    label={t.movie.comment}
                    onBlur={handleBlur('comment')}
                    onChange={handleChange('comment')}
                    error={commentError}
                    helperText={commentHelper}
                    margin="normal"
                    value={comment || ''}
                  />
                  <SubmitButton type="submit">
                    <p>{t.movie.post}</p>
                  </SubmitButton>
                </Form>
              </FormContainer>
            </InfoSection>
          </Fragment>
        }
      </Fragment>
      }
    </Hero>
  );
}