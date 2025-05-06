import Navbar from '../../components/Navbar/Navbar';

export default function Home() {
  return (
    <div className="home-page">
      <Navbar /> 

      <main>
        <h1>Главная страница</h1>
        <section>
          {/* Ваш контент здесь */}
        </section>
      </main>

    </div>
  );
}