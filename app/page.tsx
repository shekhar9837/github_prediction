"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function GitHubPrediction() {
  const [username, setUsername] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) return;

    setLoading(true);
    setError("");
    setPrediction("");

    try {
      const response = await fetch(`/api/github/${username}`);

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPrediction = () => {
    if (!prediction) return null;

    // Split the prediction text into breakable parts dynamically.
    const parts = prediction
      .split("\n\n") // Break paragraphs
      .filter((part) => part.trim() !== ""); // Remove empty lines

    return parts.map((part, index) => (
      <p key={index} className="mb-4 text-white">
        {part}
      </p>
    ));
  };

  return (
    <div className="relative w-full md:h-screen h-full overflow-auto mx-auto p-4 flex items-center justify-center flex-col gap-4 bg-neutral-900">
      <div>

      </div>
      <h1 className="text-3xl text-slate-200 font-bold mt-10 text-center">
        GitHub 2025 Prediction
      </h1>
      <p className="text-center text-gray-400">
        Enter your GitHub username to get a prediction of your 2025!
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 md:flex-row flex-col items-center mt-4 px-4"
      >
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="w-fit text-white border rounded-xl py-6"
        />
        <Button
          type="submit"
          disabled={loading}
          className="border bg-green-600 py-6 rounded-xl text-white"
        >
          {loading ? "Loading..." : "Get Prediction"}
        </Button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {prediction && (
        <div className="w-full max-w-3xl mx-auto  [background:linear-gradient(45deg,#080b11,theme(colors.neutral.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.blue.400/.48)_80%,_theme(colors.blue.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border ">
          <div className="relative text-center z-10 px-4 py-4 rounded-2xl  w-fit   h-full mx-auto">
            <h2 className="text-xl font-semibold text-white mb-4">
              Prediction for {username}:
            </h2>
            {renderPrediction()}
          </div>
        </div>
      )}

        <Link href={'https://x.com/shekhar9837'}  target="_blank"  className="text-black border  rounded-lg px-4 py-2 text-center mt-4 bg-slate-100">
        Built with ❤️ by @shekhar9837 
        </Link>    
    </div>
  );
}
