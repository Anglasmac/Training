interface HeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

const Hero = ({ title, subtitle, badge }: HeroProps) => {
  return (
    <section className='hero-card'>
      <div>
        <span className='hero-kicker'>Archivo de referencia</span>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className='hero-badge'>
        <strong>{badge ?? 'Solo front'}</strong>
        <span>Sin modificar backend ni .env</span>
      </div>
    </section>
  );
};

export default Hero;
