import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // ES6

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import Skeleton from "../skeleton/Skeleton";


import "./charInfo.scss";

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [accordion, setAccordion] = useState(false);

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        clearError();
        const { charId } = props
        if (!charId) {
            return;
        }

        getCharacter(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const onAccordion = () => {
        setAccordion(accordion => !accordion)
    }

    const skeleton = char || loading || error ? null : <Skeleton />
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !char) ? <View char={char} onAccordion={onAccordion} accordionState={accordion} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = (props) => {

    const { name, description, thumbnail, homepage, wiki, comics } = props.char;

    let thumnailStyle = { 'objectFit': 'cover' }
    if (thumbnail.slice(-23) === 'image_not_available.jpg') {
        thumnailStyle = { 'objectFit': 'contain' }
    }

    const listItems = (arr) => {
        return arr.map((item, i) => {
            // eslint-disable-next-line
            if (i > 9) return;
            return (
                <li key={i} className={props.accordionState ? 'char__comics-item' : 'char__comics-hiddenitem'}>
                    {item.name}
                </li>
            )
        })
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={thumnailStyle} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description ? description : 'There is no information about the character.'}
            </div>

            <button className={props.accordionState ? 'char__accordion char__accordion-opened' : 'char__accordion'} onClick={props.onAccordion}>
                Comics:
            </button>

            <ul className='char__comics-list'>
                {comics.length > 0 ? null : 'There are no comsics with this character'}
                {listItems(comics)}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;