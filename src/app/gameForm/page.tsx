"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";


export default function Login(){
    const [gameName, setGameName] = useState("");
    const [platform, setPlatform] = useState("");
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [physOrDig, setPhysOrDig] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit  = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        try {
            const response = await fetch("/api/Signup", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({ platform, gameName, physOrDig, notes }),
            });
            const data = await response.json();

            if(!response.ok) {
                setError(data.error);
                return;
            }
                setError("");
                router.push("/Login");

        } catch (error) {
            console.error("Form entry failed", error);
            alert("Form entry failed");
        }


    }


    return (
        <div className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400">
            <Header />
            <form onSubmit={handleSubmit}
                  className="flex flex-col gap-4 h-screen items-center justify-center bg-purple-400">
                <div className="place-items-center font-bold text-3xl text-wrap">
                    Enter Your Game!
                </div>
                <input
                    className="border-2 rounded px-3 py-2 text-black"
                    type="text"
                    placeholder={"Game Name"}
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                />
                <div className="font-bold text-2xl text-wrap">
                    Select a platform:
                </div>
                    <label>
                        <input
                            type="radio"
                            value="PC"
                            checked={platform === 'PC'}
                            onChange={(e) => {
                                setPlatform(e.target.value)
                                setShowOtherInput(false);
                            }
                        }/>
                        {" "}PC
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Playstation 5"
                            checked={platform === 'Playstation 5'}
                            onChange={(e) => {
                                setPlatform(e.target.value)
                                setShowOtherInput(false);
                            }
                        }/>
                        {" "}Playstation 5
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="XBOX Series X"
                            checked={platform === 'XBOX Series X'}
                            onChange={(e) => {
                                setPlatform(e.target.value)
                                setShowOtherInput(false);
                            }
                        }/>
                        {" "}XBOX Series X
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="Nintendo Switch"
                            checked={platform === 'Nintendo Switch'}
                            onChange={(e) => {
                                setPlatform(e.target.value)
                                setShowOtherInput(false);
                            }
                        }/>
                        {" "}Nintendo Switch
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="other"
                            checked={platform === 'other'}
                            onChange={(e) =>{
                                setPlatform(e.target.value);
                                setShowOtherInput(true);
                            }
                        } />
                        {" "}Other:
                    </label>
                {showOtherInput && <input type="text" placeholder="Enter your platform" />}
                <div className="font-bold text-2xl text-wrap">
                    Physical or Digital Copy?:
                </div>
                <label>
                    <input
                        type="radio"
                        value="physical"
                        checked={physOrDig === 'physical'}
                        onChange={(e) => setPhysOrDig(e.target.value)}
                        />
                        {" "}Physical
                </label>
                <label>
                    <input
                        type="radio"
                        value="digital"
                        checked={physOrDig === 'digital'}
                        onChange={(e) => setPhysOrDig(e.target.value)}
                        />
                        {" "}Digital
                </label>
                <div className="font-bold text-2xl text-wrap">
                    Additional Notes:
                </div>
                <textarea
                    className="border-2 rounded px-3 py-2 text-black"
                    rows={4}
                    cols={50}
                    placeholder={"Notes"}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit"
                        className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black">
                    Submit
                </button>
            </form>
        </div>


    );
}