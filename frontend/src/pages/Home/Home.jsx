import WelcomeFrame from '../../components/WelcomeFrame/WelcomeFrame';
import Categories from '../../components/Categories/Categories';
import PopularBooks from '../../components/PopularBooks/PopularBooks';

export default function Home() {
  return (
    <div className="home-page">
      <WelcomeFrame />
      <Categories /> 
      <PopularBooks /> 

      <main>
        <h1>Главная страница</h1>
        <section>
          {/* Ваш контент здесь */}
        </section>
      </main>

    </div>
  );
}
