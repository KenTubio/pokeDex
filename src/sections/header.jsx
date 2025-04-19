import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link from react-router-dom
import { FaXTwitter } from "react-icons/fa6";
import { FaPinterest, FaYoutube, FaInstagramSquare } from "react-icons/fa";
import { CiGlobe } from "react-icons/ci";
import axios from "axios";


const Header = () => {
    const location = useLocation(); // Get the current location
    const [stats, setStats] = useState({
        total: 0,
        types: 0,
        abilities: 0,
        highExpCount: 0,
        averageExp: 0,
        totalEggGroups: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pokemonRes, typeRes, abilityRes, speciesRes] = await Promise.all([
                    axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"),
                    axios.get("https://pokeapi.co/api/v2/type"),
                    axios.get("https://pokeapi.co/api/v2/ability?limit=100000&offset=0"),
                    axios.get("https://pokeapi.co/api/v2/pokemon-species?limit=100000&offset=0"),
                ]);

                // Top 50 Pokémon for base experience calculation
                const top50Details = await Promise.all(
                    pokemonRes.data.results.slice(0, 50).map(p => axios.get(p.url))
                );

                // Calculate the average base experience
                const totalExp = top50Details.reduce((acc, p) => acc + p.data.base_experience, 0);
                const averageExp = totalExp / top50Details.length;

                // Get species details to count distinct egg groups
                const speciesDetails = await Promise.all(
                    speciesRes.data.results.slice(0, 50).map(s => axios.get(s.url))
                );

                // Collect all egg groups (ensure they are unique)
                const eggGroups = new Set();
                speciesDetails.forEach(species => {
                    species.data.egg_groups.forEach(group => {
                        eggGroups.add(group.name); // Add each egg group to the set
                    });
                });

                setStats({
                    total: pokemonRes.data.count,
                    types: typeRes.data.count,
                    abilities: abilityRes.data.count,
                    highExpCount: top50Details.filter(p => p.data.base_experience > 200).length,
                    averageExp,
                    totalEggGroups: eggGroups.size, // The size of the set gives the unique egg group count
                });

            } catch (error) {
                console.error("Error fetching Pokémon stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="bg-[#0f0f0f] text-white font-sans relative">
            <header className="fixed left-0 right-0 top-0 backdrop-blur-xs z-50 flex justify-between items-center px-5 max-sm:p-3 max-sm:justify-center">
                <img className="w-40 max-sm:hidden" src="/images/poke-logo.png" alt="" />
                <figure className="flex gap-2 text-xl max-sm:text-sm">
                    <a className="bg-slate-600 hover:scale-110 transition hover:bg-slate-400 text-white p-2 rounded-full" href="https://x.com/pokemon" target="_blank">
                        <FaXTwitter />
                    </a>
                    <a className="bg-slate-600 hover:scale-110 transition hover:bg-slate-400 text-white p-2 rounded-full" href="https://ph.pinterest.com/pokemon/" target="_blank">
                        <FaPinterest />
                    </a>
                    <a className="bg-slate-600 hover:scale-110 transition hover:bg-slate-400 text-white p-2 rounded-full" href="https://www.pokemon.com/us" target="_blank">
                        <CiGlobe />
                    </a>
                    <a className="bg-slate-600 hover:scale-110 transition hover:bg-slate-400 text-white p-2 rounded-full" href="https://www.youtube.com/user/Pokemon" target="_blank">
                        <FaYoutube />
                    </a>
                    <a className="bg-slate-600 hover:scale-110 transition hover:bg-slate-400 text-white p-2 rounded-full" href="https://www.instagram.com/pokemon" target="_blank">
                        <FaInstagramSquare />
                    </a>
                </figure>
            </header>


            {/* Header Banner */}
            <div
                className="w-full h-96 max-lg:h-52 bg-cover bg-center bg-no-repeat rounded-lg mb-4"
                style={{ backgroundImage: 'url("/images/banner.gif")' }}
            />

            {/* Profile Section */}
            <div className="flex items-start space-x-4 mb-6 relative max-sm:flex-col max-sm:justify-center">
                <img
                    src="/images/profile.jpg"
                    alt="pokemon"
                    className="w-60 max-lg:w-40 max-sm:self-center max-lg:h-40 absolute max-sm:static -top-12 left-15 h-52 rounded-[3rem] object-cover object-center border-slate-500 border-4"
                />
                <div className="w-full flex  max-sm:flex-col-reverse">
                    <div className="flex-1 ml-80 max-lg:ml-60 max-sm:px-6 max-sm:ml-0">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-3xl max-lg:text-xl max-sm:text-2xl font-bold">Pokémon Apex</h1>
                            <span className="text-yellow-400 text-xl">✅</span>
                        </div>

                        <p className="text-gray-400 mt-1 flex items-center gap-2 max-lg:text-sm max-sm:text-lg">
                            <span>Elite Tier</span>
                            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                                Edition: Apex Genesis
                            </span>
                        </p>

                        <p className="mt-2 text-sm  max-lg:text-xs max-sm:text-base">
                            Clash with legends and rise to the top of the Apex League!
                        </p>

                        <div className="mt-2">
                            <span className="inline-block text-sm bg-gray-800 px-3 py-1 rounded-full max-lg:text-xs">
                                🃏 Card Game Mode: <strong>Apex Battle</strong>
                            </span>
                        </div>
                    </div>

                    <nav className="mt-4 mr-4 flex justify-center gap-6 self-center max-sm:py-5">
                        <Link
                            to="/battle"
                            className={`text-center relative inline-block text-white font-bold text-lg px-8 py-3 rounded-md 
                            bg-gradient-to-r from-blue-700 to-blue-500 shadow-[0_0_10px_rgba(0,123,255,0.8)]
                            border border-blue-300 
                            hover:scale-105 hover:shadow-[0_0_20px_rgba(0,123,255,1)] 
                            transition-transform duration-300 ease-in-out
                            before:absolute before:inset-0 before:rounded-md before:border-2 before:border-white/20 before:pointer-events-none`}
                        >
                            <img className="w-24" src="/images/poke-logo.png" alt="" />
                            Battle On!
                        </Link>
                    </nav>
                </div>


            </div>

            {/* Dynamic Pokémon Stats */}
            <div className="grid grid-cols-6 max-lg:grid-cols-3 gap-3 bg-[#161616] p-3 rounded-lg mt-13 border border-slate-700">
                <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Total Pokémon</p>
                    <p className="text-lg font-semibold">🔢 {stats.total}</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Pokémon Types</p>
                    <p className="text-lg font-semibold">🧬 {stats.types}</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Abilities</p>
                    <p className="text-lg font-semibold">✨ {stats.abilities}</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">High EXP Pokémon</p>
                    <p className="text-lg font-semibold">🔥 {stats.highExpCount}</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Average Base Experience</p>
                    <p className="text-lg font-semibold">⚡ {stats.averageExp}</p>
                </div>
                <div className="border border-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Total Egg Groups</p>
                    <p className="text-lg font-semibold">🥚 {stats.totalEggGroups}</p>
                </div>
            </div>
        </div>
    );
};

export default Header;
