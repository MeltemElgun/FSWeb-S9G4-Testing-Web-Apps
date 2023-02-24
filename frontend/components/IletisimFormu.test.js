import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import App from "../App";

test("hata olmadan render ediliyor", () => {
  render(<App />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const name = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(name, "İlha");
  expect(await screen.findByTestId("error")).toBeVisible();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const inputA = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(inputA, "Meltem");

  const inputS = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(inputS, "Meltem Meltem");

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const inputA = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(inputA, "İlhan");

  const inputS = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(inputS, "mansız");

  const inputM = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(inputM, "yüzyılıngolcüsü@hotmail");

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const inputA = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(inputA, "İlhan");

  const inputM = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(inputM, "yüzyılıngolcüsü@hotmail.com");

  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("error")).toBeVisible();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const inputA = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(inputA, "meltem");
  const inputS = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(inputS, "elgün");
  const inputM = screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
  userEvent.type(inputM, "meltem@hotmail.com");

  userEvent.click(screen.getByRole("button"));
  await waitFor(
    () => {
      const error = screen.queryAllByTestId("error");
      expect(error.length).toBe(0);
    },
    { timeout: 4000 }
  );
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  userEvent.type(screen.getByPlaceholderText("İlhan"), "Ahmet");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "Developer");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "ahmet@developer.com"
  );
  userEvent.type(screen.getByText("Mesaj"), "ödev tamamlandı");
  userEvent.click(screen.getByRole("button"));
  expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
    "Ahmet"
  );
  expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
    "Developer"
  );
  expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
    "ahmet@developer.com"
  );
  expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
    "ödev tamamlandı"
  );
});
