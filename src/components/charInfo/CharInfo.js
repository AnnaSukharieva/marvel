import { Component } from 'react/cjs/react.production.min';
import PropTypes from 'prop-types'; // ES6

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false,
        accordion: false
    }

    marvelService = new MarvelService();


    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const { charId } = this.props
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }


    onCharLoaded = (char) => {
        this.setState({ char, loading: false })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onAccordion = () => {
        this.setState(({ accordion }) => ({
            accordion: !accordion
        }))
    }

    render() {
        const { char, loading, error } = this.state;

        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !char) ? <View char={char} onAccordion={this.onAccordion} accordionState={this.state.accordion} /> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

class View extends Component {

    render() {
        const { name, description, thumbnail, homepage, wiki, comics } = this.props.char;

        let thumnailStyle = { 'objectFit': 'cover' }
        if (thumbnail.slice(-23) === 'image_not_available.jpg') {
            thumnailStyle = { 'objectFit': 'contain' }
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

                <button className={this.props.accordionState ? 'char__accordion char__accordion-opened' : 'char__accordion'} onClick={this.props.onAccordion}>
                    <i class="arrow right"></i> Comics:
                </button>

                <ul className='char__comics-list'>
                    {comics.length > 0 ? null : 'There are no comsics with this character'}
                    {
                        comics.map((item, i) => {
                            // eslint-disable-next-line
                            if (i > 9) return;
                            return (
                                <li key={i} className={this.props.accordionState ? 'char__comics-item' : 'char__comics-hiddenitem'}>
                                    {item.name}
                                </li>
                            )
                        })
                    }
                </ul>
            </>
        )
    }
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;