import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Thank you for contacting us!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="flex justify-center mt-12 mb-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="sm:text-3xl text-2xl font-bold text-center mb-8 text-gray-800">
        <span className='text-lime-400'>C</span>ontact   <span className='text-lime-400'>U</span>s</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Name + Email side by side */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-black font-medium" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="p-3 border border-gray-300 rounded focus:outline-none focus:border-lime-500"
                required
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-black font-medium" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-3 border border-gray-300 rounded focus:outline-none focus:border-lime-500"
                required
              />
            </div>
          </div>

          {/* Message full width */}
          <div className="flex flex-col">
            <label className="mb-1 text-black font-medium" htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message"
              rows="4"
              className="p-3 border border-gray-300 rounded focus:outline-none focus:border-lime-500"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-lime-400 text-black py-3 rounded hover:bg-lime-500 transition font-semibold"
          >
            Send Message
          </button>

        </form>
      </div>
    </section>
  );
}

export default Contact;
