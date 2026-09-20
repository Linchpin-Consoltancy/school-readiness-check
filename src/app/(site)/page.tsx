import Image from "next/image";
import { SiteMotion } from "./SiteMotion";

/* ===========================================================================
   THE LINCHPIN EDUCATION WEBSITE
   ===========================================================================

   The words on this page are the words from the original site, unchanged.
   If you want to edit the website, edit the text between the tags below.
   Leave anything inside < > alone, and leave className alone.

   The one thing that is new is the "Start the Free Check" button in the
   navigation bar, which opens the School Readiness Check at /check.

   The look of this page lives in site.css next to this file.
   =========================================================================== */

export default function SitePage() {
  return (
    <>
      <SiteMotion />

      {/* NAV */}
      <nav id="nav">
        <a href="#" className="nav-logo">
          <svg width="22" height="30" viewBox="0 0 54 72" fill="none">
            <circle cx="27" cy="19" r="14.5" stroke="#1B3040" strokeWidth="3" />
            <circle cx="27" cy="19" r="5" fill="#C07B2A" />
            <line x1="27" y1="33.5" x2="27" y2="56" stroke="#1B3040" strokeWidth="3" strokeLinecap="round" />
            <path d="M27 56 L14 70" stroke="#1B3040" strokeWidth="3" strokeLinecap="round" />
            <path d="M27 56 L40 70" stroke="#1B3040" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="nav-wordmark">
            <h2>Linchpin</h2>
            <p>Education</p>
          </div>
        </a>
        <div className="nav-actions">
          <a href="#contact" className="nav-cta">Get in Touch</a>
          <a href="/check" className="nav-check">Start the Free Check</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-left">
          <p className="hero-tag">School Systems Consultancy</p>
          <h1>Schools that work<br />don&apos;t happen <em>by accident.</em></h1>
          <p className="hero-sub">
            Linchpin Education partners with schools that refuse to leave quality to chance, building the systems, structures, and routines that make effective leadership sustainable and consistent learning a reality.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Get in Touch</a>
            <a href="#services" className="hero-scroll">See How We Work &darr;</a>
          </div>
          <div className="hero-rule"></div>
        </div>
        <div className="hero-right">
          <div style={{ position: "relative" }}>
            <div className="hero-img-frame">
              <Image
                src="/site/joseph-omondi.jpg"
                alt="Joseph Omondi, Founder of Linchpin Education"
                fill
                priority
                sizes="(max-width: 920px) 100vw, 40vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            <div className="hero-img-accent">
              <svg width="28" height="38" viewBox="0 0 54 72" fill="none">
                <circle cx="27" cy="19" r="14.5" stroke="#ffffff" strokeWidth="3" />
                <circle cx="27" cy="19" r="5" fill="rgba(255,255,255,0.6)" />
                <line x1="27" y1="33.5" x2="27" y2="56" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <path d="M27 56 L14 70" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <path d="M27 56 L40 70" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="hero-img-tag">Joseph Omondi &nbsp; Founder</div>
          </div>
        </div>
      </section>

      {/* FOR YOU */}
      <section className="for-you" id="for-you">
        <p className="section-label reveal">Who This Is For</p>
        <h2 className="section-heading reveal">You may be in the right place if&hellip;</h2>
        <div className="for-you-body">
          <div className="for-you-col reveal">
            <p>You are a <strong>principal</strong> who leads with dedication and commitment, yet finds it difficult to clearly identify what is driving your school&apos;s results or holding them back. Things are running, but you cannot fully explain why certain things work and others don&apos;t. You carry more than you should, and you know it.</p>
          </div>
          <div className="for-you-col reveal">
            <p>You are a <strong>director</strong> who has made a deliberate decision that quality in your school must be designed and guaranteed, not hoped for. You think about your school as both an institution and a business, and you are not willing to leave important outcomes to chance.</p>
          </div>
        </div>
        <p className="for-you-closing reveal">
          &quot;In either case, you have arrived at a point where good intentions and hard work are no longer sufficient on their own. That is exactly the school leader Linchpin Education was built to work with.&quot;
        </p>
      </section>

      {/* SERVICES */}
      <section className="services" id="services">
        <p className="section-label reveal">What We Do</p>
        <h2 className="section-heading reveal">How we work with schools</h2>
        <p className="services-intro reveal">Every Linchpin engagement begins with understanding your school accurately. No recommendations are made before that picture is clear.</p>

        <div className="diagnostic-card reveal">
          <span className="diagnostic-badge">Entry Point</span>
          <h3>The Linchpin School Diagnostic</h3>
          <p>A structured, evidence-based assessment of your school&apos;s systems, structures, and leadership routines across academic and operational domains. The process produces a written gap report with prioritised findings and establishes a shared language that informs every improvement conversation that follows. Most school leaders find the process clarifying. Many find it transformative.</p>
          <div className="diagnostic-output">What the school gets <span>A diagnostic report, a prioritised gap summary, and a shared language for every conversation that follows.</span></div>
        </div>

        <div className="services-grid">
          <div className="service-card reveal">
            <div className="service-number">01</div>
            <h3>School Systems Design</h3>
            <p>Working from the diagnostic findings, we design and help you implement the core routines and systems your school needs to run effectively: scheduling, leadership and governance routines, performance management and accountability structures, communication systems, and operational excellence workflows. We build with you so that what gets built fits your school and your team can run it independently.</p>
            <p className="service-output">Output: Documented systems, implementation support &amp; a capable team</p>
          </div>
          <div className="service-card reveal">
            <div className="service-number">02</div>
            <h3>Learning Quality Design</h3>
            <p>We work with school leaders and heads of department to design the curriculum alignment, instructional frameworks, and assessment systems that move learning quality from depending on individual teachers to being guaranteed by the system. This includes coaching for instructional leaders on how to sustain quality through supportive supervision.</p>
            <p className="service-output">Output: Aligned curriculum, instructional framework &amp; assessment systems</p>
          </div>
          <div className="service-card reveal">
            <div className="service-number">03</div>
            <h3>Middle Leadership &amp; Coaching Development</h3>
            <p>Most schools have middle leaders in title only. We work with principals and their heads of department or year to build a genuinely functional leadership layer: clarifying roles, designing the routines that make accountability real, and coaching middle leaders into the confidence and competence their positions require.</p>
            <p className="service-output">Output: Clear mandates, coaching structures &amp; a capable leadership team</p>
          </div>
          <div className="service-card reveal">
            <div className="service-number">04</div>
            <h3>Professional Development Design</h3>
            <p>Bespoke staff development programmes designed from your school&apos;s actual priorities, not a generic training catalogue. Every programme is built from your context, your staff&apos;s needs, and your school&apos;s goals, and includes the tools staff need to keep developing after the programme concludes.</p>
            <p className="service-output">Output: Tailored programme, facilitation materials &amp; repeatable structures</p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <p className="section-label reveal">A Clear Process</p>
        <h2 className="section-heading reveal">Three steps. No guesswork.</h2>
        <div className="process-steps">
          <div className="step reveal">
            <div className="step-num">1</div>
            <h3>Diagnose</h3>
            <p>We begin with the Linchpin School Diagnostic. Before any recommendations are made, we conduct a structured assessment across your school&apos;s academic and operational domains. You receive a written report with clear, prioritised findings.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">2</div>
            <h3>Design</h3>
            <p>Working directly from your diagnostic findings, we scope the improvement work that will have the greatest impact. Nothing is prescribed in advance. Everything is designed to fit your context, your team, and your goals.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">3</div>
            <h3>Build &amp; Embed</h3>
            <p>We work alongside your team to implement what has been designed, developing the internal capability that ensures your school continues to perform well beyond the end of our engagement.</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about" id="about">
        <div>
          <p className="section-label reveal">About</p>
          <h2 className="section-heading reveal">Linchpin<br />Education</h2>
          <div className="about-rule reveal"></div>
          <div className="about-photo reveal">
            <Image
              src="/site/joseph-omondi.jpg"
              alt="Joseph Omondi, Founder of Linchpin Education"
              fill
              sizes="(max-width: 920px) 100vw, 40vw"
              style={{ objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
          <p className="about-photo-caption reveal"><span>Joseph Omondi</span> &nbsp; Founder, Linchpin Education</p>
        </div>
        <div className="about-right">
          <p className="reveal">Linchpin Education was founded by <strong>Joseph Omondi</strong>, an educator and school systems specialist with a decade of experience working in and with schools. Joseph has served as a classroom teacher, a Dean of Instruction and Learning, and a specialist in learning design and innovation.</p>
          <p className="reveal">As a trainer and coach, he has worked alongside school leaders, middle tier Education Officers, and school clusters to build the capacity to deliver more effectively, implementing programmes and educational projects across the country in the process.</p>
          <p className="reveal">That breadth of experience produced one enduring conviction: most school improvement efforts fall short not because of insufficient effort or commitment, but because the underlying systems are not designed to guarantee quality. When the right structures are in place, effective leadership becomes sustainable and consistent learning becomes a natural outcome rather than an exception.</p>
          <p className="reveal">Linchpin Education exists to build those structures, with each school and for each school. Our work is grounded in ten years of direct experience within schools, a track record of designing systems from scratch across multiple school contexts, and a history of coaching school leaders and their teams to take genuine, lasting ownership of quality.</p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <p className="section-label reveal">Start the Conversation</p>
        <h2 className="section-heading reveal">Get in Touch</h2>
        <p className="reveal">If you are a school principal or director who is ready to understand your school clearly and build with intention, the most practical first step is a written conversation. Reach out through any of the channels below and we will respond promptly.</p>
        <div className="contact-buttons reveal">
          <a href="mailto:linchpineducation.ke@gmail.com" className="btn-contact btn-gold">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>
            Email Us
          </a>
          <a href="https://wa.me/254702760471?text=Hello%20Joseph%2C%20I%20came%20across%20Linchpin%20Education%20and%20would%20like%20to%20discuss%20your%20services.%20My%20name%20is%20%5Bname%5D%20and%20I%20lead%20%5Bschool%20name%5D." target="_blank" rel="noopener" className="btn-contact btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            WhatsApp
          </a>
          <a href="https://www.linkedin.com/in/joseph-omondi-a266a2133" target="_blank" rel="noopener" className="btn-contact btn-linkedin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
            LinkedIn
          </a>
        </div>
        <p className="contact-email-visible">linchpineducation.ke@gmail.com</p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <svg width="16" height="22" viewBox="0 0 54 72" fill="none">
            <circle cx="27" cy="19" r="14.5" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <circle cx="27" cy="19" r="5" fill="#C07B2A" />
            <line x1="27" y1="33.5" x2="27" y2="56" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
            <path d="M27 56 L14 70" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
            <path d="M27 56 L40 70" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="footer-logo-text">Linchpin <span>Education</span></span>
        </div>
        <p>&copy; 2025 Linchpin Education. All rights reserved.</p>
      </footer>
    </>
  );
}
