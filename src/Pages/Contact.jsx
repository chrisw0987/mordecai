import {
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  Mail,
  MessageSquareText,
  Phone,
} from "lucide-react";

const services = [
  "Website",
  "Google Presence",
  "Reviews & Reputation",
  "Digital Tools",
  "Not sure yet",
];

function Contact() {
  const [formData, setFormData] =
    useState({
      name: "",
      businessName: "",
      contact: "",
      service: "",
      message: "",
    });

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const body =
        new URLSearchParams({
          "form-name":
            "contact",
          ...formData,
        });

      const response =
        await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body:
            body.toString(),
        });

      if (!response.ok) {
        throw new Error(
          "Something went wrong."
        );
      }

      setSubmitted(true);
    } catch {
      setError(
        "We couldn't send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#F7F5EF] px-5 py-20">
        <div className="max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#AFCB83]">
            <Check
              size={28}
            />
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
            Message sent
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] text-[#17151A] sm:text-5xl">
            Thanks for reaching out.
          </h1>

          <p className="mt-5 text-lg leading-8 text-[#17151A]/60">
            We received your
            message and will get
            back to you using the
            contact information
            you provided.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#7547B8] px-7 py-4 font-semibold text-white"
          >
            Back to Mordecai
            <ArrowRight
              size={18}
            />
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F7F5EF] px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:gap-20">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7547B8]">
              Contact Mordecai
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-[0.97] tracking-[-0.055em] text-[#17151A] sm:text-6xl">
              Let's talk about
              <span className="text-[#7547B8]">
                {" "}
                your business.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#17151A]/60">
              Need a website?
              Want to improve how
              customers find you?
              Tell us what you're
              working on and we'll
              point you in the
              right direction.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href="mailto:mordecaiteam@gmail.com"
                className="flex items-center gap-4 text-[#17151A]/65"
              >
                <Mail
                  size={20}
                  className="text-[#7547B8]"
                />
                mordecaiteam@gmail.com
              </a>

              <a
                href="tel:+13479256580"
                className="flex items-center gap-4 text-[#17151A]/65"
              >
                <Phone
                  size={20}
                  className="text-[#7547B8]"
                />
                347-925-6580
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/[0.07] bg-white p-6 sm:p-9 lg:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7547B8]/10 text-[#7547B8]">
              <MessageSquareText
                size={22}
              />
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-[#17151A]">
              Send us a message.
            </h2>

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              onSubmit={
                handleSubmit
              }
              className="mt-8"
            >
              <input
                type="hidden"
                name="form-name"
                value="contact"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field
                  label="Your name"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <Field
                  label="Business name"
                  name="businessName"
                  value={
                    formData.businessName
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="mt-6">
                <Field
                  label="Email or phone"
                  name="contact"
                  value={
                    formData.contact
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-[#17151A]">
                  What can we help
                  with?
                </label>

                <select
                  name="service"
                  value={
                    formData.service
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full rounded-2xl border border-black/10 bg-[#F7F5EF] px-4 py-3.5 outline-none focus:border-[#7547B8]"
                >
                  <option value="">
                    Select one
                  </option>

                  {services.map(
                    (service) => (
                      <option
                        key={
                          service
                        }
                        value={
                          service
                        }
                      >
                        {
                          service
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-[#17151A]">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={6}
                  value={
                    formData.message
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Tell us a little about what you'd like to improve."
                  className="w-full resize-none rounded-2xl border border-black/10 bg-[#F7F5EF] px-4 py-3.5 outline-none focus:border-[#7547B8] focus:ring-4 focus:ring-[#7547B8]/10"
                />
              </div>

              {error && (
                <p className="mt-5 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7547B8] px-7 py-4 font-semibold text-white transition hover:bg-[#6439A5] disabled:opacity-60"
              >
                {submitting
                  ? "Sending..."
                  : "Send Message"}

                {!submitting && (
                  <ArrowRight
                    size={18}
                  />
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-[#17151A]"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-black/10 bg-[#F7F5EF] px-4 py-3.5 outline-none focus:border-[#7547B8] focus:ring-4 focus:ring-[#7547B8]/10"
      />
    </div>
  );
}

export default Contact;