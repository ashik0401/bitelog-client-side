import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  
  useEffect(() => {
    const checkSubscription = async () => {
      if (!email) return;
      try {
        const { data } = await axios.get(`https://bitelog-server-side.vercel.app/subscribers/check?email=${email}`);
        setSubscribed(data.subscribed);
      } catch (err) {
        console.error(err);
      }
    };
    checkSubscription();
  }, [email]);

  const handleSubscribe = async () => {
    if (!email) return toast.error("Enter your email");

    try {
      if (!subscribed) {
     
        await axios.post("https://bitelog-server-side.vercel.app/subscribers", { email });
        setSubscribed(true);
        toast.success("Subscribed successfully!");
      } else {
        
        await axios.delete(`https://bitelog-server-side.vercel.app/subscribers?email=${email}`);
        setSubscribed(false);
        toast("Unsubscribed successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <section className="py-16">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#012200] ">📩 Subscribe to our Newsletter</h2>
        <p className="mb-6">Stay updated with new meals, offers, and updates.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="rounded px-3 border border-gray-400 w-full sm:w-auto flex-1 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubscribe}
            className={` rounded border-none font-semibold transition-colors text-white duration-200 ${
              subscribed ? "bg-green-500  cursor-pointer " : " bg-[#066303] hover:bg-[#043f02]   cursor-pointer btn"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}
