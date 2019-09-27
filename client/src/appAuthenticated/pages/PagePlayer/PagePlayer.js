import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import AppContext from '../../../contexts/AppContext';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Global = styled.section`
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
`;

const Video = styled.video`
  max-width: 100vw;
  :focus {
    outline: none;
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
const LinkBack = styled(Link)`
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  &:hover {
    color: ${props => props.theme.color.red};
  }
`;

export default (props) => {
  const { currentMovieInfo } = useContext(AppContext);
  const [subs, setSubs] = useState([]);
  const [player, setPlayer] = useState(false);
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (currentMovieInfo && authToken) {
      axios
        .get(`/player/subs?id=${currentMovieInfo.imdbId}&authToken=${authToken}`)
        .then(res => {
          setSubs(
            res.data.map((e, index) => (
              <track key={index} kind="subtitles" srcLang={e.lang} src={e.path} />
            ))
          );
          if (res.status === 200) setPlayer(true);
        })
        .catch(err => console.log(err));
    }
  }, [authToken, currentMovieInfo, currentMovieInfo.imdbId]);

  return (
    <Global>
      <CloseLink to={`/movies/${props.match.params.imdbId}`}>
        <CloseIcon icon={faTimes}></CloseIcon>
      </CloseLink>
      {(authToken && currentMovieInfo && currentMovieInfo.magnet.source) ? 
        <Video controls>
          <source src={`http://localhost:5000/api/player/stream?authToken=${authToken}&provider=${currentMovieInfo.magnet.source}&id=${currentMovieInfo.imdbId}&magnet=${currentMovieInfo.magnet.magnet}`} type="video/mp4" />
          {player && subs}
        </Video>
        :
        <LinkBack to={`/movies/${props.match.params.imdbId}`}>Go back to the movie page</LinkBack>
      }
    </Global>
  );
};
