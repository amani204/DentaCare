
import Navbar     from '../../components/website/Navbar'
import Hero       from '../../components/website/Hero'
import Services   from '../../components/website/Services'
import Doctors   from '../../components/website/Doctors'
import BookingCTA from '../../components/website/BookingCTA'
import Footer from '../../components/website/Footer'

export default function Home() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Services />
      <Doctors />
      <BookingCTA/>
      <Footer/>
    </div>
  )
}
