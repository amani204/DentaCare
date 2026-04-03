
import Navbar     from '../../components/website/Navbar'
import Hero       from '../../components/website/Hero'
import Services   from '../../components/website/Services'
import Doctors   from '../../components/website/Doctors'

export default function Home() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Services />
      <Doctors />
    </div>
  )
}
