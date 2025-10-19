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

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', time: '14:20', isMine: false },
    { id: 2, text: 'Привет! Всё отлично, спасибо! А у тебя?', time: '14:21', isMine: true },
    { id: 3, text: 'Тоже хорошо! Хотела спросить про завтрашнюю встречу', time: '14:22', isMine: false },
    { id: 4, text: 'Да, конечно! В 15:00 как договаривались', time: '14:23', isMine: true },
  ]);

  const menuItems = [
    { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
    { id: 'contacts', icon: 'Users', label: 'Контакты' },
    { id: 'calls', icon: 'Phone', label: 'Звонки' },
    { id: 'channels', icon: 'Radio', label: 'Каналы' },
    { id: 'groups', icon: 'UsersRound', label: 'Группы' },
    { id: 'settings', icon: 'Settings', label: 'Настройки' },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };
      setMessages([...messages, newMessage]);
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
            "backdrop-blur-sm flex items-center justify-between px-6 py-4 rounded-t-3xl",
            isDarkMode ? "bg-gray-800/50" : "bg-white/50"
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
                <h2 className="font-medium text-foreground">
                  {chats.find(c => c.id === selectedChat)?.name}
                </h2>
                <p className="text-xs text-muted-foreground">
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

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex animate-slide-up',
                    message.isMine ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2 shadow-md backdrop-blur-sm',
                      message.isMine
                        ? 'bg-primary/90 text-white rounded-br-sm'
                        : isDarkMode ? 'bg-gray-700/80 text-white rounded-bl-sm' : 'bg-white/80 text-foreground rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "backdrop-blur-sm px-6 py-4 rounded-b-3xl",
            isDarkMode ? "bg-gray-800/50" : "bg-white/50"
          )}>
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                <Icon name="Smile" size={22} />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                <Icon name="Paperclip" size={22} />
              </Button>
              
              <Input
                placeholder="Написать сообщение..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className={cn(
                  "flex-1 backdrop-blur-sm border-0 rounded-full px-4",
                  isDarkMode ? "bg-gray-700/60 text-white" : "bg-white/60"
                )}
              />

              <Button 
                onClick={handleSendMessage}
                size="icon" 
                className="rounded-full flex-shrink-0 bg-primary hover:bg-primary/90"
              >
                <Icon name="Send" size={20} />
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
              <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-12 backdrop-blur-sm border-0 rounded-full",
                  isDarkMode ? "bg-gray-700/60 text-white placeholder:text-gray-400" : "bg-white/60"
                )}
              />
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                  <span className="text-xs text-muted-foreground max-w-[70px] truncate text-center">
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
                    'flex items-center gap-4 px-4 py-4 cursor-pointer transition-all animate-fade-in rounded-2xl backdrop-blur-sm hover:shadow-md',
                    isDarkMode ? 'bg-gray-800/60 hover:bg-gray-800/80' : 'bg-white/60 hover:bg-white/80'
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
                      <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
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
              <h1 className="text-3xl font-bold mb-2">Настройки</h1>
              <p className="text-muted-foreground">Управление вашим аккаунтом и приложением</p>
            </div>

            <div className={cn(
              "backdrop-blur-sm rounded-3xl p-6 space-y-6",
              isDarkMode ? "bg-gray-800/60" : "bg-white/60"
            )}>
              <div>
                <h2 className="text-lg font-semibold mb-4">Профиль</h2>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-400 to-blue-600">👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">Иван Иванов</h3>
                    <p className="text-sm text-muted-foreground">@ivan_ivanov</p>
                  </div>
                  <Button variant="outline" className="rounded-full">Редактировать</Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Внешний вид</h2>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name={isDarkMode ? 'Moon' : 'Sun'} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Тёмная тема</h3>
                      <p className="text-sm text-muted-foreground">Изменить цветовую схему</p>
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
                      'w-6 h-6 rounded-full bg-white absolute top-1 transition-transform shadow-md',
                      isDarkMode ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>

              <div className="border-t pt-6 space-y-3">
                <h2 className="text-lg font-semibold mb-4">Уведомления</h2>
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
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <button className="w-14 h-8 rounded-full bg-gray-300 relative">
                      <div className="w-6 h-6 rounded-full bg-white absolute top-1 translate-x-1 transition-transform shadow-md" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6 space-y-3">
                <h2 className="text-lg font-semibold mb-4">Конфиденциальность</h2>
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
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
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
            <h3 className="text-xl font-medium text-muted-foreground mb-2">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              Раздел в разработке
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-screen overflow-hidden transition-colors duration-300",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
    )}>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
        <div className={cn(
          "backdrop-blur-2xl shadow-2xl rounded-full px-6 py-3 flex items-center gap-2",
          isDarkMode ? "bg-gray-800/70 border border-gray-700/40" : "bg-white/70 border border-white/40"
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
    </div>
  );
};

export default Index;