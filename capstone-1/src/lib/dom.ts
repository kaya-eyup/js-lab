
export function getElement<T extends Element>(
  root: ParentNode,
  selector: string,
    ElementType: new () => T, // ne yazmalıyım? any yazmayacağım.
): T {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`[DOM Error] "${selector}" seçicisi ile eşleşen bir eleman bulunamadı.`);
  }

  // Çalışma zamanında (runtime) element'in gerçekten istediğimiz tipte olup olmadığını kontrol ediyoruz
  if (!(element instanceof ElementType)) {
    throw new Error(
      `[DOM Error] "${selector}" bulundu fakat beklenen tipte değil. Beklenen: ${ElementType.name}, Bulunan: ${element.constructor.name}`
    );
  }
 
  
  return element
};