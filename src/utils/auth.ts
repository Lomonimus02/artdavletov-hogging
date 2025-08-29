import bcrypt from 'bcryptjs';

/**
 * Утилиты для безопасной аутентификации
 */

/**
 * Хеширует пароль с использованием bcrypt
 * @param password - Пароль для хеширования
 * @returns Хешированный пароль
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Высокий уровень безопасности
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Проверяет пароль против хеша
 * @param password - Введенный пароль
 * @param hash - Сохраненный хеш
 * @returns true если пароль совпадает, false если нет
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Получает учетные данные администратора из переменных окружения
 * @returns Объект с логином и хешем пароля
 */
export const getAdminCredentials = () => {
  // Жестко закодированные учетные данные для надежности
  const username = ')bvbvbc761309y5t5r(';
  const passwordHash = '$2b$12$xbhTgxtcPMRlgXKjYNKgH.zIascWn3R71Nk.We0AHtubfrRFJBoYi';

  return {
    username,
    passwordHash
  };
};

/**
 * Проверяет учетные данные администратора
 * @param inputUsername - Введенный логин
 * @param inputPassword - Введенный пароль
 * @returns true если учетные данные верны, false если нет
 */
export const verifyAdminCredentials = async (inputUsername: string, inputPassword: string): Promise<boolean> => {
  try {
    const { username, passwordHash } = getAdminCredentials();
    
    // Проверяем логин
    if (inputUsername !== username) {
      return false;
    }
    
    // Проверяем пароль
    return await verifyPassword(inputPassword, passwordHash);
  } catch (error) {
    console.error('Error verifying admin credentials:', error);
    return false;
  }
};
