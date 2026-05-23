interface HeroProps {
  title: string;
  subtitle?: string;
}

const Hero = ({ title, subtitle }: HeroProps) => {
  return (
    <section className='hero-card'>
      <div>
        <span className='hero-kicker'>Archivo de referencia</span>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
};

export default Hero;
