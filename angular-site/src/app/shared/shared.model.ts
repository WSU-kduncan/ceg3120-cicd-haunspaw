// have a shared resource file that displays an understanding and knowledge of re-using data structures (modularity)
export interface User { // OPTION ONE, USE AN INTERFACE (do not utilize a constructor)
  name: string,
  email: string,
  phone: string,
  suggestions?: string
}

export class User1 { // OPTION TWO, USE A CLASS (utilize a constructor or methods relating to the class, prove you understand class vs interface)
  name: string;
  email: string;
  phone: string;
  suggestions?: string;

  constructor(name: string, email: string, phone: string, suggestions?: string) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    (suggestions) ? this.suggestions = suggestions : ''; // encourage use of ternary operators etc, I know this one isn't terribly necessary
  }

}
