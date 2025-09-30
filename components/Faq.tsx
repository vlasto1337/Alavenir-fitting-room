import React, { useState } from 'react';

const faqData = [
  {
    question: 'Как это работает?',
    answer: 'Вы загружаете свое фото, а наш искусственный интеллект, основанный на модели Google Gemini, "переодевает" вас в описанную или показанную одежду, стараясь максимально сохранить вашу позу, фон и черты лица.'
  },
  {
    question: 'Почему мое изображение не сгенерировалось или появилась ошибка?',
    answer: 'Иногда генерация может быть заблокирована встроенными фильтрами безопасности, если запрос покажется системе неоднозначным (например, с откровенной одеждой). Попробуйте переформулировать запрос более нейтрально. Также причиной могут быть временные сбои, просто попробуйте еще раз.'
  },
  {
    question: 'Почему меня слабо поменяло или совсем не изменило?',
    answer: 'Попробуйте повысить «Уровень креативности» в разделе «Расширенные настройки». Низкие значения этого параметра заставляют ИИ максимально сохранять исходное фото, включая фон и позу. Более высокие значения дают больше свободы для изменений.'
  },
  {
    question: 'Какие фотографии лучше всего подходят?',
    answer: 'Для наилучшего результата используйте качественные фотографии в полный рост или по пояс, где ваше тело и одежда хорошо видны. Избегайте фото с тенями на теле, сложными позами или где части тела перекрыты.'
  },
  {
    question: 'Мои данные в безопасности?',
    answer: 'Мы не храним ваши фотографии. Все изображения обрабатываются "на лету" и используются только для генерации нового образа в рамках вашего текущего сеанса.'
  }
];

const FaqItem: React.FC<{ item: typeof faqData[0], isOpen: boolean, onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4 px-2 focus:outline-none"
      >
        <span className="font-medium text-zinc-200">{item.question}</span>
        <svg
          className={`w-5 h-5 text-zinc-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}>
        <p className="text-zinc-400 text-sm px-2">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

export const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-12 bg-[#111111] p-6 rounded-2xl border border-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-100 mb-4">Часто задаваемые вопросы</h2>
      <div>
        {faqData.map((item, index) => (
          <FaqItem
            key={index}
            item={item}
            isOpen={openIndex === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
};