import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Godparents from "./pages/Godparents";
import Budget from "./pages/Budget";
import NotFound from "./pages/not-found";
import VolleyballCursor from "./components/VolleyballCursor";
import GuerrerFigures from "./components/GuerreroFigures";
import Petals from "./components/Petals";
import ThemeProvider from "./components/ThemeProvider";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <VolleyballCursor />
        <GuerrerFigures />
        <Petals />
        <Router hook={useHashLocation}>
          <Layout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/godparents" component={Godparents} />
              <Route path="/budget" component={Budget} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
