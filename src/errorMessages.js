// src/errorMessages.js

export const translateError = (error) => {
    if (!error) return '';

    const message = typeof error === 'string' ? error : (error.message || '');

    // Словарь популярных ошибок Supabase
    const dict = {
        'Invalid login credentials': 'Неверный email или пароль.',
        'Email not confirmed': 'Пожалуйста, подтвердите вашу почту (проверьте email).',
        'User already registered': 'Пользователь с такой почтой уже зарегистрирован.',
        'Password should be at least 6 characters': 'Пароль должен содержать минимум 6 символов.',
        'Unable to validate email address: invalid format': 'Некорректный формат email.',
        'Signup requires a valid password': 'Введите корректный пароль.',
        'Email rate limit exceeded': 'Слишком много попыток. Попробуйте позже.',
        'For security purposes, you can only request this once every 60 seconds': 'В целях безопасности запрос можно повторить только через 60 секунд.',
    };

    // Ищем точное совпадение или частичное (если ошибка пришла с дополнительным текстом)
    for (const [eng, rus] of Object.entries(dict)) {
        if (message.includes(eng)) {
            return rus;
        }
    }

    // Если перевода нет, возвращаем оригинал (или можно вернуть "Произошла ошибка")
    return message;
};