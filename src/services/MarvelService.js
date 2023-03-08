import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const { loading, request, error } = useHttp();

	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=ad1bd53a6136ab25e9ea6d9a5275f445';
	const _baseOffset = 210;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?$_apiKey}`);
		return _transformCharacter(res.data.results[0]);
	}

	const _transformCharacter = (char) => {
		return {
			name: char.name,
			description: char.description,
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			id: char.id,
			comics: char.comics.items
		}
	}

	return {loading, error, getAllCharacters, getCharacter}
}

export default useMarvelService;