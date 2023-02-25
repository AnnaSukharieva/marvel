import './charList.scss';
import { Component } from 'react/cjs/react.production.min';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {

    state = {
        chars: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.loadChars()
    }
    
    onCharLoaded = (char) => {
        this.setState({ char, loading: false })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }


    renderChar = (item) => {
        let thumnailStyle = null
        if (item.thumbnail.slice(-23) === 'image_not_available.jpg') {
            thumnailStyle = { 'objectFit': 'contain' }
        }
        
        return (
            <li
                key={item.id}
                className="char__item"
                onClick={() => this.props.onCharSelected(item.id)}>
                <img src={item.thumbnail} alt={item.name} style={thumnailStyle} />
                <div className="char__name">{item.name}</div>
            </li>
        )

    }

    loadChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(items => items.map(item => this.renderChar(item)))
            .then(chars => this.setState({ chars }))
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const { loading, chars, error } = this.state;
        const spinner = loading ?  <Spinner/> : null;
        const content = chars ? <ul className="char__grid"> {[...chars]} </ul> : null;
        const errorMessage = error ? <ErrorMessage /> : null;

        return (
            <div className="char__list">
                {spinner}
                {content}
                {errorMessage}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;