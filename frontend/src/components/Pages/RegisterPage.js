"use client"

import { useEffect, useRef, useState } from "react"
import GoogleSignIn from "../Shared_components/Login_button"
import styles from "./RegisterPage.module.css"

export default function RegisterPage() {
  useEffect(() => {
    document.title = "RoomEase | Simplify Roommate Living"
  }, [])

  // For FAQ accordion
  const [activeFaq, setActiveFaq] = useState(null)

  // For animated counters
  const [countersVisible, setCountersVisible] = useState(false)
  const statsRef = useRef(null)

  // For testimonial carousel
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = [
    {
      quote:
        "RoomEase transformed how we manage our apartment. No more arguments about who needs to take out the trash! Dishes no longer pile up and we dont have to keep going through old recipts to keep track of who owes what.",
      author: "Krish P.",
      role: "College Student",
    },
    {
      quote: "The expense tracking feature saved our friendship. We always know exactly who owes what.",
      author: "Jamie T.",
      role: "Young Professional",
    },
    {
      quote: "Setting up our apartment rules and chore schedule took minutes, and now everyone stays accountable.",
      author: "Morgan L.",
      role: "Graduate Student",
    },
  ]

  // For scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate)
            if (entry.target === statsRef.current) {
              setCountersVisible(true)
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}`)
    animatedElements.forEach((el) => observer.observe(el))

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  // Counter animation
  const Counter = ({ end, label, suffix = "" }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!countersVisible) return

      let start = 0
      const duration = 2000 // 2 seconds
      const step = end / (duration / 16) // 60fps

      const timer = setInterval(() => {
        start += step
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }, [countersVisible, end])

    return (
      <div className={styles.statCard}>
        <div className={styles.statNumber}>
          {count}
          {suffix}
        </div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    )
  }

  // FAQ toggle handler
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // Testimonial navigation
  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // 1. Add a ref for the features section and a scroll function
  const featuresRef = useRef(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className={styles.roomEaseContainer}>
      {/* Background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
        <div className={styles.floatingShape}></div>
      </div>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <h1 className={styles.navTitle}>RoomEase</h1>
          {/* 2. Remove "Pricing" and "FAQ" from the navbar and add onClick to Features */}
          {/* Replace the navLinks div with: */}
          <div className={styles.navLinks}>
            <button className={styles.navLink} onClick={scrollToFeatures}>
              Features
            </button>
            <GoogleSignIn />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={styles.mainContent}>
        <div className={styles.heroSection}>
          <div className={styles.textContent + " " + styles.animateOnScroll}>
            <h2 className={styles.mainTitle}>Simplify Roommate Living</h2>
            <p className={styles.mainDescription}>
              Organize chores, split expenses, and live stress-free with your roommates. The all-in-one platform
              designed to make shared living harmonious.
            </p>
            {/* 3. Remove the "Watch Demo" button and replace the ctaButtons div with just the primary CTA */}
            {/* that uses the GoogleSignIn component */}
            {/* Replace the ctaButtons div with: */}
            <div className={styles.ctaButtons}>
              {/* <GoogleSignIn className={styles.primaryCta} /> */}
            </div>
          </div>

          {/* Feature Cards */}
          {/* 4. Add the ref to the feature cards section */}
          {/* Find the featureCards div and add the ref: */}
          <div className={styles.featureCards} ref={featuresRef}>
            <div className={styles.featureCard + " " + styles.animateOnScroll} style={{ "--delay": "0.1s" }}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>📋</div>
              </div>
              <h3>Task Management</h3>
              <p>Assign and track household chores, and set house rules with automated reminders</p>
            </div>
            <div className={styles.featureCard + " " + styles.animateOnScroll} style={{ "--delay": "0.3s" }}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>💰</div>
              </div>
              <h3>Expense Splitting</h3>
              <p>Easily divide and track shared costs including bills, groceries, and household supplies</p>
            </div>
            <div className={styles.featureCard + " " + styles.animateOnScroll} style={{ "--delay": "0.5s" }}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>🗓️</div>
              </div>
              <h3>Shared Calendar</h3>
              <p>Coordinate schedules, events, and set shared quiet hours with integrated notifications</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection + " " + styles.animateOnScroll} ref={statsRef}>
          <h2 className={styles.sectionTitle}>Trusted by Roommates Everywhere</h2>
          <div className={styles.statsGrid}>
            <Counter end={10000} label="Happy Households" suffix="+" />
            <Counter end={98} label="Satisfaction Rate" suffix="%" />
            <Counter end={45} label="Less Roommate Conflicts" suffix="%" />
            <Counter end={30} label="Minutes Saved Daily" />
          </div>
        </div>

        {/* Testimonials Section */}
        <div className={styles.testimonialsSection + " " + styles.animateOnScroll}>
          <h2 className={styles.sectionTitle}>What Our Users Say</h2>
          <div className={styles.testimonialCarousel}>
            <button className={styles.testimonialArrow} onClick={prevTestimonial}>
              ❮
            </button>
            <div className={styles.testimonialContent}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`${styles.testimonial} ${index === activeTestimonial ? styles.activeTestimonial : ""}`}
                  style={{
                    opacity: index === activeTestimonial ? 1 : 0,
                    position: index === activeTestimonial ? "relative" : "absolute",
                    transform: "none",
                  }}
                >
                  <div className={styles.quoteIcon}>"</div>
                  <p className={styles.quote}>{testimonial.quote}</p>
                  <div className={styles.author}>
                    {/* <div className={styles.authorAvatar}></div> */}
                    <div>
                      <p className={styles.authorName}>{testimonial.author}</p>
                      <p className={styles.authorRole}>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.testimonialArrow} onClick={nextTestimonial}>
              ❯
            </button>
            <div className={styles.testimonialDots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.testimonialDot} ${index === activeTestimonial ? styles.activeDot : ""}`}
                  onClick={() => setActiveTestimonial(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection + " " + styles.animateOnScroll}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {[
              {
                question: "How does RoomEase handle expense splitting?",
                answer:
                  "RoomEase provides multiple ways to split expenses: equally, by percentage, or by specific amounts. You can track who paid what, set recurring expenses, and get notified when payments are due. The app automatically calculates balances and shows who owes whom.",
              },
              {
                question: "Can I all my bills accross my different rooms?",
                answer:
                  "Yes! RoomEase allows you to add bills to your household and split them accross your different rooms. You are able to see an agregated view of all your bills and who owes what in the Master Room.",
              },
              {
                question: "Is RoomEase free to use?",
                answer:
                  "RoomEase offers a free basic plan that includes expense tracking and chore management. Premium features like calendar integration, unlimited expense history, and advanced reporting are available with our affordable subscription plans.",
              },
              {
                question: "How do I invite my roommates to join?",
                answer:
                  "After creating your household, you can invite roommates via email, SMS, or by sharing a unique invitation link. They'll receive instructions to join your household and set up their accounts.",
              },
            ].map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <span className={styles.faqIcon}>{activeFaq === index ? "−" : "+"}</span>
                </button>
                <div className={`${styles.faqAnswer} ${activeFaq === index ? styles.faqAnswerOpen : ""}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection + " " + styles.animateOnScroll}>
          <div className={styles.ctaContent}>
            <h2>Ready to simplify your shared living experience?</h2>
            <p>Join thousands of happy roommates using RoomEase today.</p>
            {/* 6. Replace the primary CTA in the CTA section with GoogleSignIn */}
            {/* Find: */}
            {/* <button className={styles.primaryCta}>Get Started Free</button> */}
            {/* Replace with: */}
            {/* <GoogleSignIn className={styles.primaryCta} /> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h2 className={styles.footerLogo}>RoomEase</h2>
            <p>Simplifying roommate living since 2023</p>
            <div className={styles.socialLinks}>
              <button className={styles.socialIcon}>𝕏</button>
              <button className={styles.socialIcon}>ƒ</button>
              <button className={styles.socialIcon}>𝕀</button>
              <button className={styles.socialIcon}>𝕃</button>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkGroup}>
              <h3>Product</h3>
              <button className={styles.footerLink}>Features</button>
              <button className={styles.footerLink}>Pricing</button>
              <button className={styles.footerLink}>Testimonials</button>
              <button className={styles.footerLink}>FAQ</button>
            </div>
            <div className={styles.footerLinkGroup}>
              <h3>Company</h3>
              <button className={styles.footerLink}>About Us</button>
              <button className={styles.footerLink}>Careers</button>
              <button className={styles.footerLink}>Blog</button>
              <button className={styles.footerLink}>Contact</button>
            </div>
            <div className={styles.footerLinkGroup}>
              <h3>Legal</h3>
              <button className={styles.footerLink}>Privacy Policy</button>
              <button className={styles.footerLink}>Terms of Service</button>
              <button className={styles.footerLink}>Cookie Policy</button>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 RoomEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
