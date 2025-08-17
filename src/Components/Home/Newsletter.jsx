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
        const { data } = await axios.get(`http://localhost:5000/subscribers/check?email=${email}`);
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
     
        await axios.post("http://localhost:5000/subscribers", { email });
        setSubscribed(true);
        toast.success("Subscribed successfully!");
      } else {
        
        await axios.delete(`http://localhost:5000/subscribers?email=${email}`);
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4">📩 Subscribe to our Newsletter</h2>
        <p className="mb-6">Stay updated with new meals, offers, and updates.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-xl text-black w-full sm:w-auto flex-1 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubscribe}
            className={`px-6 py-3 rounded-md font-semibold transition-colors duration-200 ${
              subscribed ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-orange-600 dark:bg-orange-500"
            }`}
          >
            {subscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>
      </div>
    </section>
  );
}
