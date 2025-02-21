import React, { useState } from 'react';
import './App.css';

function App() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchPokemon = async (e) => {
    e.preventDefault();
    if (!pokemonName) return;

    setLoading(true);
    setError(null);
    setPokemon(null);

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`
      );
      
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }

      const data = await response.json();
      setPokemon({
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map(type => type.type.name),
        height: data.height / 10, // Convert to meters
        weight: data.weight / 10, // Convert to kg
        abilities: data.abilities.map(ability => ability.ability.name)
      });
    } catch (err) {
      setError('Pokemon not found! Try another name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Pokemon Finder</h1>
        <form onSubmit={searchPokemon}>
          <input
            type="text"
            value={pokemonName}
            onChange={(e) => setPokemonName(e.target.value)}
            placeholder="Enter Pokemon name..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {loading && <div className="loading">Searching...</div>}
        {error && <div className="error">{error}</div>}
        
        {pokemon && (
          <div className="pokemon-card">
            <img 
              src={pokemon.image} 
              alt={pokemon.name}
              className="pokemon-image"
            />
            <h2 className="pokemon-name">
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h2>
            <div className="pokemon-types">
              {pokemon.types.map(type => (
                <span key={type} className={`type ${type}`}>
                  {type}
                </span>
              ))}
            </div>
            <div className="pokemon-info">
              <p>Height: {pokemon.height}m</p>
              <p>Weight: {pokemon.weight}kg</p>
              <p>Abilities: {pokemon.abilities.join(', ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 