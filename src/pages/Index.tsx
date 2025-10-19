import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
}

interface Story {
  id: number;
  name: string;
  avatar: string;
  viewed: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const stories: Story[] = [
    { id: 1, name: 'Моя история', avatar: '👤', viewed: false },
    { id: 2, name: 'Анна', avatar: '👩', viewed: false },
    { id: 3, name: 'Максим', avatar: '👨', viewed: true },
    { id: 4, name: 'Елена', avatar: '👩‍💼', viewed: false },
    { id: 5, name: 'Игорь', avatar: '👨‍💻', viewed: true },
  ];

  const chats: Chat[] = [
    { id: 1, name: 'Анна Смирнова', avatar: '👩', lastMessage: 'Привет! Как дела?', time: '14:23', unread: 2, online: true },
    { id: 2, name: 'Рабочая группа', avatar: '👥', lastMessage: 'Максим: Встреча перенесена на 15:00', time: '13:45', unread: 5 },
    { id: 3, name: 'Мама', avatar: '❤️', lastMessage: 'Не забудь позвонить', time: '12:30', online: true },
    { id: 4, name: 'Александр', avatar: '👨', lastMessage: 'Отправил документы', time: '11:15' },
    { id: 5, name: 'Проект 2024', avatar: '📁', lastMessage: 'Вы: Всё готово', time: 'вчера' },
    { id: 6, name: 'Елена', avatar: '👩‍💼', lastMessage: 'Спасибо за помощь!', time: 'вчера' },
    { id: 7, name: 'Техподдержка', avatar: '🤖', lastMessage: 'Бот: Ваш запрос обработан', time: 'вчера' },
  ];

  const chatMessages: Record<number, Message[]> = {
    1: [
      { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false },
      { id: 2, text: 'Привет! Всё отлично, спасибо! А у тебя?', time: '14:21', isMine: true },
      { id: 3, text: 'Тоже хорошо! Хотела спросить про завтрашнюю встречу', time: '14:22', isMine: false },
      { id: 4, text: 'Да, конечно! В 15:00 как договаривались', time: '14:23', isMine: true },
    ],
    2: [
      { id: 1, text: 'Коллеги, у нас изменения в расписании', time: '13:30', isMine: false },
      { id: 2, text: 'Встреча перенесена на 15:00', time: '13:45', isMine: false },
      { id: 3, text: 'Понял, спасибо!', time: '13:46', isMine: true },
    ],
    3: [
      { id: 1, text: 'Не забудь позвонить', time: '12:30', isMine: false },
      { id: 2, text: 'Хорошо, мама, позвоню вечером', time: '12:31', isMine: true },
    ],
    4: [
      { id: 1, text: 'Отправил документы на почту', time: '11:15', isMine: false },
      { id: 2, text: 'Получил, проверю', time: '11:16', isMine: true },
    ],
    5: [
      { id: 1, text: 'Всё готово к презентации', time: 'вчера', isMine: true },
      { id: 2, text: 'Отличная работа!', time: 'вчера', isMine: false },
    ],
    6: [
      { id: 1, text: 'Спасибо за помощь!', time: 'вчера', isMine: false },
      { id: 2, text: 'Всегда рад помочь', time: 'вчера', isMine: true },
    ],
    7: [
      { id: 1, text: 'Здравствуйте! Как я могу вам помочь?', time: 'вчера', isMine: false },
      { id: 2, text: 'Ваш запрос обработан', time: 'вчера', isMine: false },
    ],
  };

  const [messages, setMessages] = useState<Record<number, Message[]>>(chatMessages);

  const menuItems = [
    { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
    { id: 'contacts', icon: 'Users', label: 'Контакты' },
    { id: 'calls', icon: 'Phone', label: 'Звонки' },
    { id: 'channels', icon: 'Radio', label: 'Каналы' },
    { id: 'groups', icon: 'UsersRound', label: 'Группы' },
    { id: 'settings', icon: 'Settings', label: 'Настройки' },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const currentMessages = messages[selectedChat] || [];
      const newMessage: Message = {
        id: currentMessages.length + 1,
        text: messageInput,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };
      setMessages({
        ...messages,
        [selectedChat]: [...currentMessages, newMessage]
      });
      setMessageInput('');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (selectedChat) {
      return (
        <div className="flex-1 flex flex-col h-full">
          <div className={cn(
            "flex items-center justify-between px-6 py-4 rounded-t-3xl liquid-shine",
            isDarkMode ? "glass-morphism-dark" : "glass-morphism-light"
          )}>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedChat(null)} className="lg:hidden">
                <Icon name="ArrowLeft" size={24} />
              </button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="text-xl bg-gradient-to-br from-blue-400 to-blue-600">
                  {chats.find(c => c.id === selectedChat)?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className={cn("font-medium", isDarkMode ? "text-white" : "text-foreground")}>
                  {chats.find(c => c.id === selectedChat)?.name}
                </h2>
                <p className={cn("text-xs", isDarkMode ? "text-gray-300" : "text-muted-foreground")}>
                  {chats.find(c => c.id === selectedChat)?.online ? 'в сети' : 'был(а) недавно'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="Phone" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Icon name="Video" size={20} />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <div className="space-y-4 max-w-4xl mx-auto">
              {(messages[selectedChat] || []).map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex animate-slide-up',
                    message.isMine ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2 shadow-lg liquid-shine',
                      message.isMine
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-sm'
                        : isDarkMode ? 'glass-morphism-dark text-white rounded-bl-sm' : 'glass-morphism-light text-foreground rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className={cn("text-xs mt-1 block text-right", message.isMine ? "opacity-80" : isDarkMode ? "text-gray-300 opacity-70" : "opacity-70")}>
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "fixed bottom-0 left-0 right-0 px-6 py-3 liquid-shine border-t",
            isDarkMode ? "glass-morphism-dark border-gray-800" : "glass-morphism-light border-gray-200"
          )}>
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <Button variant="ghost" size="icon" className={cn("rounded-full flex-shrink-0 h-9 w-9", isDarkMode ? "text-gray-300 hover:text-white" : "")}>
                <Icon name="Smile" size={20} />
              </Button>
              <Button variant="ghost" size="icon" className={cn("rounded-full flex-shrink-0 h-9 w-9", isDarkMode ? "text-gray-300 hover:text-white" : "")}>
                <Icon name="Paperclip" size={20} />
              </Button>
              
              <Input
                placeholder="Написать сообщение..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className={cn(
                  "flex-1 border-0 rounded-full px-4 h-9 liquid-shine",
                  isDarkMode ? "glass-morphism-dark text-white placeholder:text-gray-400" : "glass-morphism-light"
                )}
              />

              <Button 
                onClick={handleSendMessage}
                size="icon" 
                className="rounded-full flex-shrink-0 bg-primary hover:bg-primary/90 h-9 w-9"
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === 'chats') {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="p-6">
            <div className="relative">
              <Icon name="Search" size={20} className={cn("absolute left-4 top-1/2 -translate-y-1/2", isDarkMode ? "text-gray-400" : "text-muted-foreground")} />
              <Input
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-12 border-0 rounded-full liquid-shine",
                  isDarkMode ? "glass-morphism-dark text-white placeholder:text-gray-500" : "glass-morphism-light"
                )}
              />
            </div>
          </div>

          <div className="px-6 pb-4 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0">
                  <div className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-105',
                    story.viewed ? 'ring-2 ring-gray-300' : 'ring-2 ring-primary'
                  )}>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      {story.avatar}
                    </div>
                  </div>
                  <span className={cn("text-xs max-w-[70px] truncate text-center", isDarkMode ? "text-gray-300" : "text-muted-foreground")}>
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={cn(
                    'flex items-center gap-4 px-4 py-4 cursor-pointer transition-all animate-fade-in rounded-2xl hover:shadow-xl liquid-shine',
                    isDarkMode ? 'glass-morphism-dark hover:scale-[1.02]' : 'glass-morphism-light hover:scale-[1.02]'
                  )}
                >
                  <div className="relative">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-400 to-blue-600">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={cn("font-medium truncate", isDarkMode ? "text-white" : "text-foreground")}>{chat.name}</h3>
                      <span className={cn("text-xs ml-2 flex-shrink-0", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>{chat.time}</span>
                    </div>
                    <p className={cn("text-sm truncate", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>{chat.lastMessage}</p>
                  </div>

                  {chat.unread && (
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">
                      {chat.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === 'settings') {
      return (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className={cn("text-3xl font-bold mb-2", isDarkMode ? "text-white" : "")}>Настройки</h1>
              <p className={cn(isDarkMode ? "text-gray-400" : "text-muted-foreground")}>Управление вашим аккаунтом и приложением</p>
            </div>

            <div className={cn(
              "rounded-3xl p-6 space-y-6 liquid-shine",
              isDarkMode ? "glass-morphism-dark" : "glass-morphism-light"
            )}>
              <div>
                <h2 className={cn("text-lg font-semibold mb-4", isDarkMode ? "text-white" : "")}>Профиль</h2>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-400 to-blue-600">👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className={cn("font-medium text-lg", isDarkMode ? "text-white" : "")}>Иван Иванов</h3>
                    <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>@ivan_ivanov</p>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icon name="Pencil" size={18} />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className={cn("text-lg font-semibold mb-4", isDarkMode ? "text-white" : "")}>Внешний вид</h2>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name={isDarkMode ? 'Moon' : 'Sun'} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className={cn("font-medium", isDarkMode ? "text-white" : "")}>Тёмная тема</h3>
                      <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>Изменить цветовую схему</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={cn(
                      'w-14 h-8 rounded-full transition-colors relative',
                      isDarkMode ? 'bg-primary' : 'bg-gray-300'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full absolute top-1 transition-transform shadow-md',
                      isDarkMode ? 'bg-gray-900 translate-x-7' : 'bg-white translate-x-1'
                    )} />
                  </button>
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <h2 className={cn("text-lg font-semibold mb-4", isDarkMode ? "text-white" : "")}>Уведомления</h2>
                {[
                  { icon: 'Bell', title: 'Уведомления о сообщениях', description: 'Получать push-уведомления' },
                  { icon: 'Volume2', title: 'Звуки', description: 'Звук при получении сообщений' },
                  { icon: 'Vibrate', title: 'Вибрация', description: 'Вибрация при уведомлениях' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name={item.icon} size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className={cn("font-medium", isDarkMode ? "text-white" : "")}>{item.title}</h3>
                        <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>{item.description}</p>
                      </div>
                    </div>
                    <button className="w-14 h-8 rounded-full bg-gray-300 relative">
                      <div className="w-6 h-6 rounded-full bg-white absolute top-1 translate-x-1 transition-transform shadow-md" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3">
                <h2 className={cn("text-lg font-semibold mb-4", isDarkMode ? "text-white" : "")}>Конфиденциальность</h2>
                {[
                  { icon: 'Lock', title: 'Статус онлайн', description: 'Кто видит когда вы в сети' },
                  { icon: 'Eye', title: 'Прочитанные', description: 'Отправлять отметки о прочтении' },
                  { icon: 'Shield', title: 'Двухфакторная аутентификация', description: 'Защита аккаунта' },
                ].map((item, index) => (
                  <button key={index} className="w-full flex items-center gap-3 py-3 hover:bg-white/40 rounded-2xl px-3 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name={item.icon} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className={cn("font-medium", isDarkMode ? "text-white" : "")}>{item.title}</h3>
                      <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>{item.description}</p>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </button>
                ))}
              </div>

              <div className="border-t pt-6">
                <Button variant="destructive" className="w-full rounded-full">
                  <Icon name="LogOut" size={20} className="mr-2" />
                  Выйти из аккаунта
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 opacity-50">
          <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name={menuItems.find(item => item.id === activeSection)?.icon || 'MessageCircle'} size={64} className="text-primary/30" />
          </div>
          <div>
            <h3 className={cn("text-xl font-medium mb-2", isDarkMode ? "text-gray-400" : "text-muted-foreground")}>
              {menuItems.find(item => item.id === activeSection)?.label}
            </h3>
            <p className={cn("text-sm", isDarkMode ? "text-gray-500" : "text-muted-foreground")}>
              Раздел в разработке
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden transition-colors duration-500 relative",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white" 
        : "bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"
    )}>
      <div className={cn(
        "absolute inset-0 liquid-gradient pointer-events-none",
        isDarkMode ? "opacity-10" : "opacity-30"
      )} />
      <div className="flex-1 overflow-hidden pb-24">
        {renderContent()}
      </div>

      {!selectedChat && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <div className={cn(
          "rounded-full px-6 py-3 flex items-center gap-2 liquid-shine bubble-float shadow-2xl",
          isDarkMode ? "glass-morphism-dark" : "glass-morphism-light"
        )}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSelectedChat(null);
              }}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all relative group',
                activeSection === item.id
                  ? 'bg-primary text-white shadow-lg scale-110'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700/60 hover:scale-105'
                    : 'text-gray-600 hover:bg-white/60 hover:scale-105'
              )}
              title={item.label}
            >
              <Icon name={item.icon} size={20} />
              <span className="absolute bottom-full mb-3 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        </div>
      )}
    </div>
  );
};

export default Index;