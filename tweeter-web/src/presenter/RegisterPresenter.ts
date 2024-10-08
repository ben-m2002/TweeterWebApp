import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
  setImageUrl(url: string): void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";
  private _imageUrl = "";

  constructor(view: RegisterView) {
    super(view);
  }

  get imageBytes(): Uint8Array {
    return this._imageBytes;
  }

  set imageBytes(value: Uint8Array) {
    this._imageBytes = value;
  }

  get imageFileExtension(): string {
    return this._imageFileExtension;
  }

  set imageFileExtension(value: string) {
    this._imageFileExtension = value;
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        this.imageBytes = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.view.setImageUrl("");
      this._imageBytes = new Uint8Array();
    }
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ) {
    await this.doFailureReportOperation(async () => {
      this.isLoading = true;
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension,
      );
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigate("/");
    }, "register user");
    this.isLoading = false;
  }
}
